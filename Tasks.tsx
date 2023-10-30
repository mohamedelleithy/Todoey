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
    // handle add task logic here
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
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.task}>{task.text}</Text>
                <Text
                  style={task.isDone ? styles.taskStatus : styles.pendingTask}
                >
                  {task.isDone ? "Done" : "Not Done"}
                </Text>
              </View>
              <Button
                onPress={() => {
                  handleDeleteTask(task.id);
                }}
                title="Delete"
              ></Button>
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
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
  },
  pendingTask: {
    fontSize: 16,
    color: "red",
  },
});
