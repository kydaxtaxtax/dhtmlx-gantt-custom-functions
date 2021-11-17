
function getAllocatedValue(start_date, tasks, resource) // считает значение нагрузки в часах по факту для конкретного ресурса из всех назначенных ему задач
{
  var result = 0;
    tasks.forEach(function (item)//проходим по всем задачам
    {
      var n = contentOfDays(item.start_date, item.end_date, start_date);
      var assignments = gantt.getResourceAssignments(resource.id, item.id); // массив вида [{ task_id: "5833", resource_id: "e_6", value: "8" }]
      assignments.forEach(function (assignment)// проходим по всем р
      {
        result += Number(assignment.value) * n;// складываем нагрузку на день из всех задач
      });
    });
  return result;
}

Date.prototype.daysInMonth = function() //колличесто дней в месяце
{
	return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
};

function daysInYear(year) //колличесто дней в году
{
  return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
}

function contentOfDays(startD, endD, date) // колличество нагрузки в указанный период
{
  switch (gantt.ext.zoom.getCurrentLevel())//уровень зума
  {
    case 0: //дни
      return 1;
      break;

    case 1: //недели
      var period = 5;
      break;

    case 2: //месяца
      var period = date.daysInMonth();
      break;

    case 3: //года
      var period = daysInYear(date.getFullYear());
      break;
  }
  var result = 0;
  for (let i = 0; i < period; i += 1)
  {
    if ((startD.valueOf() <= addDays(date, i).valueOf()) && (addDays(date, i).valueOf() < endD.valueOf()))//если рассматриваемая ячейка ресурсов входит в диапазон времени по плану
    {
      if (addDays(date, i).getDay() != 0 && addDays(date, i).getDay() != 6)// если не выходной
      {
        result += 1;
      }
    }
  }
  return result;
}

function addDays(date, days)// прибавление дней к дате
{
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calcBusinessDays(startDate, endDate)// результатом функции является разница в днях между 2 датами без учета выходных дней
{
  var day = moment(startDate);
  var businessDays = 0;

  while (day.isSameOrBefore(endDate,'day'))
  {
    if (day.day() != 0 && day.day() != 6) businessDays++;
    day.add(1,'d');
  }
  return businessDays - 1;
}

function addDays(date, days)// прибавление дней к дате
{
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function shouldHighlightTask(task) // проверяет??????????????
{
  var store = gantt.$resourcesStore; // список ресурсов
  var taskResource = task[gantt.config.resource_property]; // содержимое capacity
  var selectedResource = store.getSelectedId();
  if (taskResource == selectedResource || store.isChildOf(taskResource, selectedResource))
  {
    return true;
  }
}





function getCapacity(date, resource) //рассчитываем объем по плану на каждый день
{
  if (gantt.$resourcesStore.hasChild(resource.id)) //если у ресурса нету дочек
  {
    return -1;
  }

  var task_Id = gantt.getState().selected_task; // достаем id выбранной задачи
  var task = gantt.getTask(task_Id);// достаем задачу

  var taskPar = gantt.getTask(task.parent);
  if((task.render == "split") || (taskPar == "") || (taskPar == undefined) || (taskPar == null))//если задача является родителем
  {
    var taskPar = task;
    if(taskPar.planned_start == taskPar.planned_end)// если равны(могут быть не определены, но при этом равны)
    {
      return -1;
    }
  }

  if ((task == "") || (task == undefined) || (task == null))// если не обнаружена выбранная задача
  {
    return -1;
  }

  var pForDay = (resource.value / calcBusinessDays(taskPar.planned_start, taskPar.planned_end)).toFixed(2);// план на каждый день

  if(contentOfDays(taskPar.planned_start, taskPar.planned_end, date) == 0)
  {
    return -1;
  }

  if (date.getDay() == 0 || date.getDay() == 6)// если выходной
  {
    return -1;
  }

  if ((taskPar.planned_start.valueOf() <= date.valueOf()) && (date.valueOf() < taskPar.planned_end.valueOf()))//если рассматриваемая ячейка ресурсов входит в диапазон времени по плану
  {
    return (contentOfDays(taskPar.planned_start, taskPar.planned_end, date) * pForDay).toFixed(2);
  }
    else
  {
    return null;
  }
  return -1;
}



gantt.templates.histogram_cell_label = function (start_date, end_date, resource, tasks)// вывод текста внутри каждого дня
{

  if (resource.value)
  {
    switch (getCapacity(start_date, resource))
    {
      case -1:
        break;

      case null:
        if ((getAllocatedValue(start_date, tasks, resource) != 0))
        {
          return getAllocatedValue(start_date, tasks, resource) + "/0"; //вывод факта и плана
        }
        break;

      default:
        return getAllocatedValue(start_date, tasks, resource) + "/" + getCapacity(start_date, resource); //вывод факта и плана



    }
  }
};


gantt.templates.histogram_cell_class = function (start_date, end_date, resource, tasks)// цвета
{

  if(getCapacity(start_date, resource) == null)
  {
    return "column_red"
  }

  else
  {
    if (getAllocatedValue(start_date, tasks, resource) < getCapacity(start_date, resource))
    {
      return "column_orange"
    }
  return "column_green"
  }
};




gantt.templates.histogram_cell_capacity = function (start_date, end_date, resource, tasks)//план для каждого ресурса
{
  if (!resource.value)
  {
  	return -1;
  }
  var f = getCapacity(start_date, resource);

  switch (gantt.ext.zoom.getCurrentLevel())
  {

    case 0:

      switch (f)
      {
        case -1:
          return 0;
          break;

        case null:
          if ((getAllocatedValue(start_date, tasks, resource) != 0))
          {
            return 0;
          }
          break;

        default:

        resource.capacity = Number.parseInt(f * 100);
        return Number.parseInt(f * 100);
      }
      break;

    case 1:
      switch (f)
      {
        case -1:
          return 0;
          break;

        case null:
          if ((getAllocatedValue(start_date, tasks, resource) != 0))
          {
            return 0;
          }
          break;

        default:

          if(typeof(resource.capacity) == "number")
          {
            return Number.parseInt(f * 100);
          }

          resource.capacity = Number.parseInt(f * 100);
          return Number.parseInt(f * 100);
      }

      break;

    case 2:
      break;

    case 3:
      break;
  }
};

gantt.templates.histogram_cell_allocated = function (start_date, end_date, resource, tasks)//высота заполненной области в гистограмме
{
  if (getCapacity(start_date, resource) == null && getAllocatedValue(start_date, tasks, resource) != 0)// для просроченых задач
  {
      return resource.capacity;
  }
  return getAllocatedValue(start_date, tasks, resource) * 100;
};

function shouldHighlightResource(resource)// выделение ресурса
{
  var selectedTaskId = gantt.getState().selected_task; //id выбранной задачи
  if (gantt.isTaskExists(selectedTaskId))// если это задача существует, тогда
  {
    var selectedTask = gantt.getTask(selectedTaskId),//достае задачу по id
    selectedResource = selectedTask[gantt.config.resource_property];// достаем содержимое capacity
    if (resource.id == selectedResource)
    {
      return true;
    }

    else if (gantt.$resourcesStore.isChildOf(selectedResource, resource.id))
    {
      return true;
    }
  }
  return false;
}

var resourceTemplates =
{
  grid_row_class: function (start, end, resource) {
    var css = [];
    if (gantt.$resourcesStore.hasChild(resource.id)) {
      css.push("folder_row");
      css.push("group_row");
    }
    if (shouldHighlightResource(resource)) {
      css.push("highlighted_resource");
    }
    return css.join(" ");
  },
  task_row_class: function (start, end, resource) {
    var css = [];
    if (shouldHighlightResource(resource)) {
      css.push("highlighted_resource");
    }
    if (gantt.$resourcesStore.hasChild(resource.id)) {
      css.push("group_row");
    }

    return css.join(" ");
  }
};

gantt.config.resource_render_empty_cells = true; //сообщает временной шкале ресурса для отображения элементов и шаблонов вызовов для нераспределенных ячеек

function getResourceAssignments(resourceId)
{
  var assignments;
  var store = gantt.getDatastore(gantt.config.resource_store); //получаем об

  if (store.hasChild(resourceId)) {
    assignments = [];
    store.getChildren(resourceId).forEach(function (childId) {
      assignments = assignments.concat(gantt.getResourceAssignments(childId));
    });
  } else {
    assignments = gantt.getResourceAssignments(resourceId);
  }
  return assignments;
}


/*
gantt.attachEvent("onBeforeTaskSelected", function(id)
{
  var task2 = gantt.getTask(id);

  console.log(task2.ResourseOn);
  return true;
});
*/




var resourceConfig =
{
  scale_height: 30,
  row_height: 45,
  columns: [/*
    { name: "wbs", label: "№", align: "center", width: 60, resize: true, resize: true, template: function (resource)
      {

        var wbs = gantt.getWBSCode(resource);
        return wbs;


        return resource.$level+1
      }
    },*/
    {
      name: "name", label: "Наименование", tree: true, width: 620, template: function (resource)
      {

        if (resource.text.length <= 80)
        {
          return resource.text;
        }

        var len = resource.text.length; //длина передаваемой строки
        var string1s = resource.text.slice(0, 90);// промежуточное значение первой строки
        var gap = string1s.lastIndexOf(' ');// позиция последнего пробела промежуточного значения первой строки
        var str1 = resource.text.slice(0, gap); // первая строка
        var str2 = resource.text.slice(gap, len); // вторая строка

        return "<p class='line_break'>" + str1 + "</p><p class='line_break1'>" + str2 + "</p>"; //вывод


      }, resize: true
    },
    {
      name: "progress", label: "Прогресс", align: "center", width: 130, template: function (resource)
      {

        if ((resource.value == null) || (resource.value == undefined)) // если родитель, то не выводим
        {
          return "";
        }

        var totalDuration = 0;

        var assignments = getResourceAssignments(resource.id);//возвращает все задачи назначенные ресурсу
        assignments.forEach(function (assignment) {
          var task = gantt.getTask(assignment.task_id);
          totalDuration += Number(assignment.value) * task.duration;
        });
        if(totalDuration == "0")
        {
          return "0%";
        }

        if(100 / resource.value * totalDuration > "100")
        {
          return 100 + "%";
        }

        return Math.floor(100 / resource.value * totalDuration) + "%";
      }, resize: true
    },
    {
      name: "workload", label: "Объем по факту", align: "center", width: 130, template: function (resource)
      {

        if ((resource.value == null) || (resource.value == undefined)) // если родитель, то не выводим
        {
          return "";
        }

        var totalDuration = 0;

        var assignments = getResourceAssignments(resource.id);//возвращает все задачи назначенные ресурсу
        assignments.forEach(function (assignment) {
          var task = gantt.getTask(assignment.task_id);
          totalDuration += Number(assignment.value) * task.duration;
        });

        return totalDuration.toFixed(2) + " "+ resource.units;

      }, resize: true
    },

    {
      name: "capacity", label: "Объем по плану", align: "center", width: 130, template: function (resource)
      {

        if ((resource.value == null) || (resource.value == undefined)) // если родитель, то не выводим
        {
          return "";
        }
        return  parseFloat(resource.value).toFixed(2) + " "+ resource.units; // превращаем resource.value в число с плавающей точкой, а после округляем до сотых

      }
    }

  ]
};





gantt.templates.resource_cell_value = function (start_date, end_date, resource, tasks)
{
  return "<div>" + tasks.length * 8 + "</div>";

};


gantt.config.auto_scheduling = true; // Автоматическое планирование при смещении сроков задач
gantt.config.auto_scheduling_strict = true;// включает режим автоматического планирования, в котором задачи всегда перепланируются на максимально раннюю дату
gantt.config.resource_store = "resource";
gantt.config.resource_property = "capacity";
gantt.config.open_tree_initially = true;

gantt.$resourcesStore = gantt.createDatastore
  ({
    name: gantt.config.resource_store,
    type: "treeDatastore",
    initItem: function (item)
    {
      item.parent = item.parent || gantt.config.root_id;
      item[gantt.config.resource_property] = item.parent;
      if (!item.parent)
      {
        item.open = true;
      }
      else
      {
        item.open = false;
      }
      return item;
    }
  });

gantt.$resourcesStore.attachEvent("onAfterSelect", function (id)
{
  gantt.refreshData();
});


gantt.attachEvent("onTaskLoading", function (task)
{

  var capacityValue = task[gantt.config.resource_property];// нагрузка для конкретной задачи

  if (task[gantt.config.resource_property] == "")// если нагрузка не пустая
  {
    task[gantt.config.resource_property] = [{ resource_id: 5, value: 0 }];//'Unassigned' group
  }
  else
  {
    task[gantt.config.resource_property] = JSON.parse(task[gantt.config.resource_property]);
  }

  if((task.resourceOn != null) || (task.resourceOn != undefined))
  {
    gantt.$resourcesStore.parse(task.resourceOn);
    console.log(task.resourceOn);
  }
  return true;
});


function toggleGroups(input) // переключает группы
{
  gantt.$groupMode = !gantt.$groupMode;
  if (gantt.$groupMode) {
    input.value = "show gantt view";

    var groups = gantt.$resourcesStore.getItems().map(function (item) {
      var group = gantt.copy(item);
      group.group_id = group.id;
      group.id = gantt.uid();
      return group;
    });

    gantt.groupBy
      ({
        groups: groups,
        relation_property: gantt.config.resource_property,
        group_id: "group_id",
        group_text: "text",
        delimiter: ", ",
        default_group_label: "Not Assigned"
      });
  }
  else {
    input.value = "show resource view";
    gantt.groupBy(false);
  }
}

gantt.$resourcesStore.attachEvent("onParse", function () // срабатывает после анализа данных но до их отображения
{
  var people = []; // создаем массив

  gantt.$resourcesStore.eachItem(function (res)
  {
    if (!gantt.$resourcesStore.hasChild(res.id))
    {
      var copy = gantt.copy(res);
      copy.key = res.id;
      copy.label = res.text;
      copy.unit = "часы";
      people.push(copy);
    }
  });
  gantt.updateCollection("people", people);
});
/*
  gantt.$resourcesStore.parse
  ([
			{ id: 1, text: "Трудозатраты", parent: null },
			{ id: 2, text: "Экспл. машин", parent: null },
			{ id: 3, text: "Материалы", parent: null },
			{ id: 5, text: "Не определено", parent: null, default: true },
			{ id: 6, text: "John", parent: 1 },
			{ id: 7, text: "Mike", parent: 1 },
			{ id: 8, text: "Anna", parent: 1 },
			{ id: 9, text: "Bill", parent: 1 },
			{ id: 10, text: "Floe", parent: 1 }
		]);


*/














gantt.templates.resource_cell_class = function (start_date, end_date, resource, tasks) //классы для ресурсного
{
  var css = [];
  css.push("resource_marker");
  if (tasks.length <= 1) {
    css.push("workday_ok");
  } else {
    css.push("workday_over");
  }
  return css.join(" ");
};
