libs.tasks = {
    data: {
        currentProject: false,
        currentTask: false,
        list: {
            noPrj: [],
            projects: []
        }
    },
    // Functions
    init: function () {
        chrome.storage.sync.set({
            "tasks": {
                noPrj: [],
                projects: []
            }
        }, function () {
            libs.tasks.data.list = {
                noPrj: [],
                projects: []
            };
            console.log("[tasks]: [init] Initialized tasks");
        });
    },
    load: function (callback) {
        chrome.storage.sync.get(["tasks"], function (stor) {
            if (stor.tasks) {
                libs.tasks.data.list = stor.tasks;
                if (callback) {
                    callback(stor.tasks);
                    console.log("[tasks]: [load] Running callback");
                }
            }
        });
        console.log("[tasks]: [load] Loading tasks");
    },
    save: function () {
        chrome.storage.sync.set({
            "tasks": libs.tasks.data.list
        });
        console.log("[tasks]: [save] Saving tasks");
    },
    t: {
        add: function (task, project, currentProject, callback) {
            if (task) {
                libs.tasks.load(function (tasks) {
                    if (currentProject) {
                        var Xproject = libs.tasks.data.currentProject;
                    } else {
                      var Xproject = project;
                    }
                    if (Xproject) {
                        var projectN = libs.tasks.nFromId("project", Xproject);
                        if (libs.tasks.data.list.projects[projectN]) {
                                libs.tasks.data.list.projects[projectN].tasks.push({
                                    "name": task,
                                    "opt": {}
                                });
                            console.log("[tasks]: [t.add] Adding task " + task + " to project " + Xproject);
                        } else {
                            console.log("[tasks] ERROR: [addTask] Project does not exists");
                        }
                    } else {
                        libs.tasks.data.list.noPrj.push({
                            "name": task,
                            "content": {}
                        });
                        console.log("[tasks]: [t.add] Adding task " + task + " to no-project task list");
                    }
                    libs.tasks.save();
                    if (callback) {
                        callback();
                    }
                });
            } else {
                console.log("[tasks] ERROR: [t.add] Task not specified");
            }
        },
        remove: function (n, project) {
            libs.tasks.load(function (tasks) {
                if (project) {
                    var projectN = libs.tasks.nFromId("project", project);
                    libs.tasks.data.list.projects[projectN].tasks.remove(n);
                } else {
                    libs.tasks.data.list.noPrj.remove(n);
                }
                libs.tasks.save();
            });
        },
        removeByName: function (task, project, currentProject) {
            if (task) {
                libs.tasks.load(function (tasks) {
                    if (currentProject) {
                        project = libs.tasks.data.currentProject;
                    }
                    if (project) {
                      var projectN = libs.tasks.nFromId("project", project);
                        for (var i = 0; i < libs.tasks.data.list.projects[projectN].tasks.length; i++) {
                            if (libs.tasks.data.list.projects[projectN].tasks[i].name === task) {
                                libs.tasks.t.remove(i, project);
                                console.log("[tasks]: [t.removeByName] Task removed by name: " + task + " (" + i + ") in project " + project);
                            }
                        }
                    } else {
                        for (var i = 0; i < libs.tasks.data.list.noPrj.length; i++) {
                            if (libs.tasks.data.list.noPrj[i].name === task) {
                                libs.tasks.t.remove(i);
                                console.log("[tasks]: [t.removeByName] Task removed by name: " + task + " (" + i + ")");
                            }
                        }
                    }
                });
            } else {
                console.log("[tasks] ERROR: [t.removeByName] Task not specified");
            }
        }
    },
    p: {
        add: function (project, callback) {
            if (project) {
                libs.tasks.load(function (tasks) {
                        libs.tasks.data.list.projects.push({
                            "name": project,
                            "opt": {},
                            "tasks": []
                        });
                    console.log("[tasks]: [p.add] Adding project " + project);
                    libs.tasks.save();
                    if (callback) {
                        callback();
                    }
                });
            } else {
                console.log("[tasks] ERROR: [p.add] Project not specified");
            }
        },
        remove: function (n) {
            libs.tasks.load(function (tasks) {
                libs.tasks.data.list.projects.remove(n);
                libs.tasks.save();
                console.log("[tasks]: [p.remove] Project " + n + " has been removed");
            });
        },
        removeByName: function (project) {
            if (project) {
                libs.tasks.load(function (tasks) {
                    var projectN = libs.tasks.nFromId("project", project);
                    for (var i = 0; i < libs.tasks.data.list.projects.length; i++) {
                        if (libs.tasks.data.list.projects[i].name === project) {
                            libs.tasks.p.remove(i);
                            console.log("[tasks]: [p.removeByName] Project removed by name: " + project + " (" + i + ")");
                        }
                    }
                });
            } else {
                console.log(" [tasks] ERROR: [p.removeByName] Project not specified ");
            }
        }
    },
    nFromId: function (type, id, a) {
        if (type === "project") {
            for (var i = 0; i < libs.tasks.data.list.projects.length; i++) {
                if (libs.tasks.data.list.projects[i].name === id) {
                    console.log(" [tasks]: [nFromId] Project id " + id + " has n " + i);
                    return i;
                }
            }
        } else if (type === "task") {
            if (a) {
                var project = libs.tasks.nFromId("project", id);
                for (var i = 0; i < libs.tasks.data.list.projects[project]; i++) {
                    if (libs.tasks.data.list.projects[project].tasks[i].name === id) {
                        console.log(" [tasks]: [nFromId] Task id " + id + "from project " + a + " has n " + i);
                        return i;
                    }
                }
            } else {
                for (var i = 0; i < libs.tasks.data.list.noPrj.length; i++) {
                    if (libs.tasks.data.list.noPrj[i].name === id) {
                        console.log(" [tasks]: [nFromId] Task id " + id + " has n " + i);
                        return i;
                    }
                }
            }
        }
    },
    check: function (type, id, project, currentProject) {
      if(type==="task"){
        if (currentProject) {
            var projectN = libs.tasks.nFromId("project ", libs.tasks.data.currentProject);
            for (var i = 0; i < libs.tasks.data.list.projects[projectN].length; i++) {
                if (libs.tasks.data.list.projects[projectN].tasks[i].name === id) {
                    console.log('[tasks]: [check] "' + id + '" (tasks[' + i + "]) exists ");
                    return true;
                }
            }
            console.log(" [tasks]: [check] " + id + "does not exist");
            return false;
        } else if (project) {
            var projectN = libs.tasks.nFromId("project ", project);
            for (var i = 0; i < libs.tasks.data.list.projects[projectN].length; i++) {
                if (libs.tasks.data.list.projects[projectN].tasks[i].name === id) {
                    console.log('[tasks]: [check] "Task ' + id + '" (' + i + ") exists ");
                    return true;
                }
            }
            console.log("[tasks]: [check] " + id + " does not exist ");
            return false;
        } else {
            for (var i = 0; i < libs.tasks.data.list.nPrj.length; i++) {
                if (libs.tasks.data.list.nPrj[i].name === id) {
                    console.log('[tasks]: [check] "Task ' + id + '" (' + i + ") exists ");
                    return true;
                }
            }
            console.log(" [tasks]: [check]" + id + "does not exist ");
            return false;
        }
      } else if(type==="project"){
        for (var i = 0; i < libs.tasks.data.list.projects.length; i++) {
                if (libs.tasks.data.list.projects[i].name === id) {
                    console.log('[tasks]: [check] "Project ' + id + '" (' + i + ") exists ");
                    return true;
                }
            }
            console.log(" [tasks]: [check] Project " + id + "does not exist ");
            return false;
      }
    },
    setCurrent: function (a, b, both) {
        if (both) {
            libs.tasks.data.currentProject = b;
            libs.tasks.data.currentTask = a;
        } else {
            if (a === "project") {
                libs.tasks.data.currentProject = b;
                console.log(" [tasks]: [setCurrent] Setting currentProject value to: " + b);
            } else if (a === "task") {
                libs.tasks.data.currentTask = task;
                console.log(" [tasks]: [setCurrent] Setting currentTask value to: " + b);
            }
        }
    }
};