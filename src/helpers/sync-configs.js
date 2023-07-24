import RNCalendarEvents from "react-native-calendar-events";
import dbHelper from "../database";
import webServices from "../web-services";
import _ from "lodash";
import i18n from "../../i18n";
import appStorage from "../storage";
import { resetHeyosungCalendar } from "./calendars";
import moment from "moment";
import { Alert } from "react-native";

const saveLocations = async (locations) => {
  let locationData = "";
  for (let index = 0; index < locations.length; index++) {
    const element = locations[index];
    if (index === locations.length - 1) {
      locationData =
        locationData + `(${Number(element.id)},"${element.name}");`;
    } else {
      locationData =
        locationData + `(${Number(element.id)},"${element.name}"),`;
    }
  }
  await dbHelper
    .insertLocation(locationData)
    .then(([tx, results]) => {
      console.log("insertLocation: ", results.rows.raw());
    })
    .catch((error) => console.log("###insertLocation - error: ", error));
};

const saveMachine = async (locations) => {
  let machineInsertSql = "";
  const machines = [];
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    for (let i = 0; i < location.equipments.length; i++) {
      let machine = location.equipments[i];
      machines.push(machine);
      machineInsertSql =
        machineInsertSql +
        `(${Number(machine.id)},"${machine.name}","${machine.latitude}","${
          machine.longitude
        }",${Number(location.id)}),`;
    }
  }
  let machineData =
    machineInsertSql.slice(0, machineInsertSql.length - 1) + ";";
  // insert machine
  await dbHelper
    .insertMachine(machineData)
    .then(([tx, results]) => {
      console.log("insertMachine: ", results.rows.raw());
    })
    .catch((error) => console.log("###insertMachine - error: ", error));
  // insert attribute
  await Promise.all(
    machines.map((machine) => saveAttributes(machine.attributes, machine.id))
  );
};

const saveTimesheet = async (timesheets) => {
  // insert to DB
  await Promise.all(
    timesheets.map((element) => dbHelper.insertTimesheet(element))
  )
    .then(() => {
      console.log("insertTimesheet finished");
    })
    .catch((error) => console.log("###insertTimesheet - error: ", error));
};

const registerCalendarEvents = async (timesheets) => {
  // request calendar permission
  RNCalendarEvents.requestPermissions().then(
    async (result) => {
      console.log("request calendar permission - result:", result);
      if (result === "authorized" && !_.isEmpty(timesheets)) {
        // check to create hyosung calendar
        const newCalendarId = await resetHeyosungCalendar();
        // add new events to this calendar
        timesheets.map((event) =>
          RNCalendarEvents.saveEvent(event.name, {
            calendarId: newCalendarId,
            startDate: moment(event.start_date).toISOString(),
            endDate: moment(event.start_date)
              .add(event.duration, "hours")
              .toISOString(),
            alarms: [
              {
                date: moment(event.start_date)
                  .subtract(15, "minutes")
                  .toISOString(),
              },
              {
                date: moment(event.start_date).toISOString(),
              },
            ],
          })
        );
      }
    },
    (error) => {
      console.log("request calendar permission - error:", error);
    }
  );
};

const saveAttributes = async (attributes, machineId) => {
  let attributesInsertSql = "";
  for (let index = 0; index < attributes.length; index++) {
    const attribute = attributes[index];
    attributesInsertSql =
      attributesInsertSql +
      `(${Number(attribute.id)},"${attribute.kind}","${attribute.No}","${
        attribute.unit_name
      }",${Number(machineId)}),`;
  }
  let attributeData =
    attributesInsertSql.slice(0, attributesInsertSql.length - 1) + ";";
  await dbHelper
    .insertAttributes(attributeData)
    .then(([tx, results]) => {
      console.log("insertAttributes: ", results.rows.raw());
    })
    .catch((error) => console.log("###insertAttributes - error: ", error));
};

export default async function syncConfigs() {
  const response = await webServices.getConfigs();
  if (webServices.isValidResponse(response)) {
    await appStorage.saveConfig(response.data);
    await saveLocations(response.data.locations);
    await saveMachine(response.data.locations);
    await saveTimesheet(response.data.timesheet);
    await registerCalendarEvents(response.data.timesheet);
  } else {
    Alert.alert(i18n.t("error"), i18n.t("txt_get_data_error"));
  }
}
