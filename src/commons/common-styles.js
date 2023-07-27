import { StyleSheet, Dimensions } from "react-native";
import {
  sizeScale,
  sizeFont,
  sizeHeight,
  sizeWidth,
} from "./responsive";
import Colors from "./colors";
export default StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  marginLeft_30: {
    marginLeft: sizeScale(30),
  },
});
