import { DialogActionType } from "@aws-sdk/client-lex-runtime-v2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface Task {
  id: string;
  text: string;
  isDone: boolean;
  userId: string;
}

export default function Tasks() {
  const API_URL = "http://192.168.1.116:3000";
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = async () => {
    if (task === "") {
      // alert user that task cannot be empty
      return;
    }
    try {
      await fetch(API_URL + "/addTaskById", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: await AsyncStorage.getItem("userId"),
          text: task,
        }),
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(async (data) => {
            // set object to tasks
            tasks.push({
              id: data.id,
              text: data.task,
              isDone: false,
              userId: data.userId,
            });
            loadTasks();
            setTask("");
          });
        } else {
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // handle delete task logic here
    try {
      await fetch(API_URL + "/deleteTaskById", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: taskId,
        }),
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(async (data) => {
            loadTasks();
          });
        } else {
          console.log(response.status);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // load the tasks from the database
  const loadTasks = async () => {
    // handle load tasks logic here
    try {
      await fetch(API_URL + "/tasksById", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: await AsyncStorage.getItem("userId"),
        }),
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(async (data) => {
            // set object to tasks
            setTasks(data);
          });
        } else {
          console.log(response.status);
        }
      });
    } catch (error) {
      console.log(error);
      // alert user that there is an error
      alert("There is an error, please try again later");
    }
    return tasks;
  };

  async function toggleDoneTask(taskId: string) {
    // mark task as done in the database, create a new api endpoint for this
    try {
      await fetch(API_URL + "/toggleTaskStatusById", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: taskId,
        }),
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(async (data) => {
            loadTasks();
          });
        } else {
          console.log(response.status);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function editTaskTitle(task: string, taskId: string) {
    // call the api to edit the task title
    try {
      await fetch(API_URL + "/editTaskById", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: taskId,
          text: task,
        }),
      }).then((response) => {
        if (response.status === 200) {
          response.json().then(async (data) => {
            loadTasks();
          });
        } else {
          console.log(response.status);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddTask}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {tasks.map((task, index) => (
          <TouchableOpacity
            key={index}
            style={styles.taskContainer}
            onPress={() => {
              toggleDoneTask(task.id);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <TextInput
                  style={styles.task}
                  onEndEditing={(text) => {
                    editTaskTitle(text.nativeEvent.text, task.id);
                  }}
                >
                  {task.text}
                </TextInput>
                <Text
                  style={task.isDone ? styles.taskStatus : styles.pendingTask}
                >
                  {task.isDone ? "Done" : "Not Done"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  handleDeleteTask(task.id);
                }}
                style={styles.deleteButton}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007aff",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 40,
    justifyContent: "center",
    width: 80,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    height: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  taskContainer: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  task: {
    fontSize: 16,
  },
  taskStatus: {
    fontSize: 16,
    color: "green",
    marginBottom: 10,
  },
  pendingTask: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
});
