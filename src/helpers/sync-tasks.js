import dbHelper from "../database";
import appStorage from "../storage";
import webServices from "../web-services";
import _ from "lodash";
import moment from "moment";
import { Alert } from "react-native";
import i18n from "../../i18n";

const saveTask = async (task) => {
  if (task) {
    // check existing
    if (task.id) {
      // delete task & detail
      await dbHelper.deleteTaskDetail(task.id);
      await dbHelper.deleteTask(task.id);
    }
    // save task
    const [tx, results] = await dbHelper.insertTask(task);
    // save task detail
    await Promise.all(
      task.attributes.map((attribute) =>
        dbHelper.insertTaskDetail(attribute, results.insertId)
      )
    );
  }
};

const saveTasks = async (tasks) => {
  if (!_.isEmpty(tasks)) {
    // insert to task and task_detail table
    await Promise.all(tasks.map((task) => saveTask(task)));
  }
};

const pullTasks = async () => {
  const response = await webServices.getTasks();
  if (webServices.isValidResponse(response)) {
    const tasks = response.data.data.map((it) => {
      const newIt = { ...it };
      newIt.task_id = newIt.id;
      newIt.id = null;
      return newIt;
    });
    await saveTasks(tasks);
  } else {
    Alert.alert(i18n.t("error"), i18n.t("txt_get_data_error"));
  }
};

const pushUnsyncedTasks = async () => {
  try {
    // get unsynced tasks
    const [tx, unsyncedTaskResults] = await dbHelper.getUnsyncedTasks();
    const unsyncedTasks = unsyncedTaskResults.rows.raw();
    // get task details
    const taskDetailResults = await Promise.all(
      unsyncedTasks.map((taskItem) => {
        return dbHelper.getTaskDetail(taskItem.id);
      })
    );
    taskDetailResults.forEach(([tx, taskDetailResults]) => {
      const taskDetails = taskDetailResults.rows.raw();
      if (!_.isEmpty(taskDetails)) {
        const taskDetail = taskDetails[0];
        const foundTaskIndex = unsyncedTasks.findIndex(
          (it) => it.id === taskDetail.task_id
        );
        if (foundTaskIndex !== -1) {
          const foundTask = unsyncedTasks[foundTaskIndex];
          foundTask.attributes = taskDetails;
          foundTask.user = JSON.parse(foundTask.user);
          unsyncedTasks[foundTaskIndex] = foundTask;
        }
      }
    });
    console.log(
      "###getUnsyncedTasks - unsyncedTasks2: ",
      JSON.stringify(unsyncedTasks)
    );
    // push task to server
    await Promise.all(
      unsyncedTasks.map((taskItem) => {
        return webServices
          .saveTask({
            date_complete: `${moment(taskItem.updated_at)
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss")}.000000`,
            latitude: taskItem.latitude,
            longitude: taskItem.longitude,
            machine_id: taskItem.machine_id,
            user_id: taskItem.user.id,
            attributes: taskItem.attributes.map((detail) => ({
              id: detail.attribute_id,
              value: detail.value,
            })),
          })
          .then((response) => {
            console.log("###api save task - response: ", response);
            if (
              webServices.isValidResponse(response) &&
              response.data.result.data
            ) {
              const taskId = response.data.result.data;
              dbHelper.updateRemoteTaskId(taskItem.id, taskId);
            }
            return response;
          })
          .catch((error) => console.log("###api save task - error: ", error));
      })
    );
  } catch (error) {
    console.log("###pushUnsyncedTasks - error: ", error);
  } finally {
    console.log("###pushUnsyncedTasks - finished");
  }
};

const pushAllLocalTasks = async () => {
  try {
    // get all tasks
    const [tx, allTaskResults] = await dbHelper.getAllTasks();
    const allTasks = allTaskResults.rows.raw();
    // get task details
    const taskDetailResults = await Promise.all(
      allTasks.map((taskItem) => {
        return dbHelper.getTaskDetail(taskItem.id);
      })
    );
    taskDetailResults.forEach(([tx, taskDetailResults]) => {
      const taskDetails = taskDetailResults.rows.raw();
      if (!_.isEmpty(taskDetails)) {
        const taskDetail = taskDetails[0];
        const foundTaskIndex = allTasks.findIndex(
          (it) => it.id === taskDetail.task_id
        );
        if (foundTaskIndex !== -1) {
          const foundTask = allTasks[foundTaskIndex];
          foundTask.attributes = taskDetails;
          foundTask.user = JSON.parse(foundTask.user);
          allTasks[foundTaskIndex] = foundTask;
        }
      }
    });
    console.log(
      "###getAllTasks - allTasks2: ",
      JSON.stringify(allTasks)
    );
    // push task to server
    await Promise.all(
      allTasks.map((taskItem) => {
        return webServices
          .saveTask({
            date_complete: `${moment(taskItem.updated_at)
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss")}.000000`,
            latitude: taskItem.latitude,
            longitude: taskItem.longitude,
            machine_id: taskItem.machine_id,
            user_id: taskItem.user.id,
            attributes: taskItem.attributes.map((detail) => ({
              id: detail.attribute_id,
              value: detail.value,
            })),
          })
          .then((response) => {
            console.log("###api save task - response: ", response);
            if (
              webServices.isValidResponse(response) &&
              response.data.result.data
            ) {
              const taskId = response.data.result.data;
              dbHelper.updateRemoteTaskId(taskItem.id, taskId);
            }
            return response;
          })
          .catch((error) => console.log("###api save task - error: ", error));
      })
    );
  } catch (error) {
    console.log("###pushAllLocalTasks - error: ", error);
  } finally {
    console.log("###pushAllLocalTasks - finished");
  }
};

const generateInputTasks = async () => {
  console.log("###generateInputTasks");
  // get all machines
  const [tx, machineResults] = await dbHelper.getAllMachines();
  const machines = machineResults.rows.raw();
  // get all attributes
  const attributesResults = await Promise.all(
    machines.map((machine) => dbHelper.getMachineAttributes(machine.id))
  );
  // mapping machine and attributes
  attributesResults.forEach(([tx, attributesResult]) => {
    const attributes = attributesResult.rows.raw();
    if (!_.isEmpty(attributes)) {
      const att = attributes[0];
      const machineIndex = machines.findIndex(
        (machine) => machine.id === att.machine_id
      );
      if (machineIndex !== -1) {
        const machine = machines[machineIndex];
        machine.attributes = attributes;
        machines[machineIndex] = machine;
      }
    }
  });
  // generate task
  console.log(
    "###generateInputTasks - machines: ",
    JSON.stringify(
      machines.filter(
        (machine) => machine.attributes && !_.isEmpty(machine.attributes)
      )
    )
  );
  await saveTasks(
    machines
      .filter((machine) => machine.attributes && !_.isEmpty(machine.attributes))
      .map((machine) => ({
        id: null,
        machine_id: machine.id,
        user: {
          id: appStorage.currentUser.uid,
          name: appStorage.currentUser.name,
        },
        attributes: machine.attributes.map((att) => ({
          ...att,
          value: null,
        })),
      }))
  );
};

export { pullTasks, pushUnsyncedTasks, pushAllLocalTasks, saveTask, generateInputTasks };
