
gantt.locale.labels.section_priority = "Priority";

gantt.config.xml_date = "%Y-%m-%d %H:%i:%s"; // формат вводимой даты
gantt.config.task_height = 24; // высота задачи по факту
gantt.config.row_height = 48; // высота строки 48
gantt.config.auto_scheduling_compatibility = true;
gantt.locale.labels.section_split = "Display";
gantt.config.duration_unit = "day";// Устанавливает единицу длительности задачи
gantt.config.fit_tasks = true; //автоматическое расширение шкалы времени

var dateToStr = gantt.date.date_to_str(gantt.config.task_date);
var id = gantt.addMarker({
    start_date: new Date(),
    css: "today",
    title:dateToStr(new Date())
});
setInterval(function(){
    var today = gantt.getMarker(id);
    today.start_date = new Date();
    today.title = date_to_str(today.start_date);
    gantt.updateMarker(id);
}, 1000*60);


// var start = moment();
// 	gantt.addMarker({
// 		start_date: start,
// 		css: "status_line",
// 		text: "Start project",
// 		title: "Start project: " + date_to_str(start)
// 	});

/*
gantt.attachEvent("onParse", function ()
{
  gantt.eachTask(function (task) {
    if (gantt.hasChild(task.id)) {
      task.type = gantt.config.types.project;
      console.log(gantt.config.types.project);
      gantt.updateTask(task.id);
    } else if (task.duration === 0) {
      task.type = gantt.config.types.milestone;
      gantt.updateTask(task.id);
    }
  });
});
*/

gantt.attachEvent("onLightboxSave", function(id, task, is_new) // изменяем конфигурацию задчаи при нажатии на кнопку "Сохранить"
{
  if(is_new)
  {
    console.log(task);
    if (task.type == 1)
    {
      task.type = "project";
      task.open = true;
      return true;
    }
    if (task.type == 2)
    {
      task.type = "project";
      task.render = "split";
      task.open = false;
      return true;
    }
    console.log(task.parent)
    var taskP = gantt.getTask(task.parent);
    if(taskP.render == "split")
    {
      console.log();
        //добавлеие новой сплит задачи в конец а не на текущее время
      var idB = gantt.getPrevSibling(id);// id предыдущей задачи того же уровня в дереве

      if (idB != null)
      {
        var taskB = gantt.getTask(idB);// объек предыдущей задачи того же уровня в дереве
        task.start_date = taskP.end_date;
        task.end_date = endDays(taskP.end_date, 1);
      }


      task.type = "splitTask";
      return true;
    }
  }
  console.log(gantt.getParent(task.id));
  return true;
})


gantt.addTaskLayer({// редактирование задач по плану
  renderer: {
    render: function draw_planned(task) {
      if (task.planned_start && task.planned_end) {
        var sizes = gantt.getTaskPosition(task, task.planned_start, task.planned_end);
        var el = document.createElement('div');
        el.className = 'baseline';
        el.style.left = sizes.left + 'px';
        el.style.width = sizes.width + 'px';
        el.style.height = 36 + 'px';
        el.style.top = sizes.top + gantt.config.task_height + -11 + 'px';//отступ плана от факта
        return el;
      }
      return false;
    },
    // определить getRectangle, чтобы подключить слой с помощью умного рендеринга
    getRectangle: function (task, view) {
      if (task.planned_start && task.planned_end) {
        return gantt.getTaskPosition(task, task.planned_start, task.planned_end);
      }
      return null;
    }
  }
});

gantt.templates.task_class = function (start, end, task) // определяет класс CSS, который будет применяться к панелям задач(колбасам)
{
  if (task.planned_end) {
    var classes = ['has-baseline'];
    if (end.getTime() > task.planned_end.getTime())
    {
      classes.push('overdue');
    }
    return classes.join(' ');
  }
};

gantt.templates.rightside_text = function (start, end, task) //подсчет "Превышения"
{
  if (task.type != "splitTask")
  {
    if (task.planned_end)
    {
      if (end.getTime() > task.planned_end.getTime())
      {
        var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
        var text = "<p>Превышение: " + overdue + " д.</p>";
        return text;
      }
    }
  }
  return ;
};

//gantt.config.sort = true; // сортировка
//gantt.config.work_time = true; //позволяет рассчитывать продолжительность задач в рабочее время вместо календарного
//gantt.config.show_tasks_outside_timescale = true;//Отображает задачи на графике, если даже они выходят за пределы max_date

gantt.ext.fullscreen.getFullscreenElement = function ()// на весь экран
{
  return document.getElementById("myCover");
}

gantt.templates.tooltip_text = function (start, end, task)//  Вывод всплывающего окна
{
  return "<b>Наименование:</b> " + task.text +
    "<br/><b>Ответственный:</b> " + task.responsible;
  //"<br/><b>End date:</b> "+gantt.templates.tooltip_date_format(end);
};




gantt.templates.task_row_class = function (start, end, task)// Класс с для временной шкалы
{
  if (shouldHighlightTask(task))
  {
      return "highlighted_resource";
  }
  return "task_row_class";
};

gantt.templates.grid_row_class = function (start, end, task) {
  var css = [];
  if (gantt.hasChild(task.id)) {
    css.push("folder_row");
  }

  if (task.$virtual) {
    css.push("group_row")
  }

  if (shouldHighlightTask(task)) {
    css.push("highlighted_resource");
  }

  return css.join(" ");
};



gantt.templates.grid_header_class = function (start, end, task)// Класс для шапки таблицы
{
  return "grid_header_class";
};

gantt.templates.scale_row_class = function (start, end, task)// Класс для шапки времени
{
  return "scale_row_class";
};
/*
var weekday = Xmas95.getFullYear();
console.log(weekday);
*/


// Масштаб повторного рендеринга при перетаскивании задач
gantt.attachEvent("onTaskDrag", function (id, mode, task, original) {
  var state = gantt.getState();
  var minDate = state.min_date,
    maxDate = state.max_date;
  var scaleStep = gantt.date.add(new Date(), state.scale_step, state.scale_unit) - new Date();
  var showDate,
    repaint = false;
  if (mode == "resize" || mode == "move") {
    if (Math.abs(task.start_date - minDate) < scaleStep) {
      showDate = task.start_date;
      repaint = true;

    } else if (Math.abs(task.end_date - maxDate) < scaleStep) {
      showDate = task.end_date;
      repaint = true;
    }

    if (repaint) {
      gantt.render();
      gantt.showDate(showDate);
    }
  }
});



var formatFunc = gantt.date.date_to_str("%d-%m-%Y");//Формат отображаемой даты
/*
var textEditor = { type: "text", map_to: "text" };
var dateEditor1 = { type: "date", map_to: "start_date" };
var dateEditor2 = { type: "date", map_to: "end_date" };
var dateEditor3 = { type: "date", map_to: "planned_start" };
var dateEditor4 = { type: "date", map_to: "planned_end" };
var durationEditor = { type: "number", map_to: "progress" };
*/
function priorityLabel(task) {
  var value = task.priority;
  var list = gantt.serverList("priority");
  for (var i = 0; i < list.length; i++) {
    if (list[i].key == value) {
      return list[i].label;
    }
  }
  return "";
}


/*
gantt.config.keyboard_navigation = true; //Навигация с помощью клавиатуры
gantt.config.keyboard_navigation_cells = true; //Навигация по ячейкам
*/


// function saveType(task)
// {
//
//   var task = gantt.getTask(id);// достаем задачу
//   // if(task.resourceOn == undefined)
//
//   if(task.render != true || task.type == "splitTask")
//   {
//
//   }
//
//   if(!haschild(id) || task.tupe == "splittask")
//   if(task.resourceOn == undefined)
//   {
//
//   }
//
//
//
//   if(task.resourceOn == undefined)
//   {
//
//   }
//
//   if(task.resourceOn == undefined)
//   {
//
//   }
//   console.log(task.resourceOn);
// }




function myFunc_s_f(task) {

  var tta = Math.round(100 / (task.ob_plan / task.ob_fact));
  if (!(100 > tta > 0) || (task.render = "split"))
  {
    return "<div class='not_active'>" + formatFunc(task.start_date) + "</div>";
  }
  return formatFunc(task.start_date);
}

function myFunc_e_f(task) {
  var tta = Math.round(100 / (task.ob_plan / task.ob_fact));
  if (!(100 > tta > 0) || (task.render = "split"))
  {
    return "<div class='not_active'>" + formatFunc(task.end_date) + "</div>";
  }
    return formatFunc(task.end_date);
}

function myFunc_s_p(task) {
  var tta = task.planned_start;
  if ((tta != null) || (tta != undefined)) {
    return formatFunc(task.planned_start);
  }
  else { return "-" }
}

function myFunc_e_p(task) {
  var tta = task.planned_end;
  if ((tta != null) || (tta != undefined)) {
    return formatFunc(task.planned_end);
  }
  else { return "-" }
}


function progress_PF(task) // считаем прогресс
{
  var recountedProgress; // создаем глобальную переменную прогресса

  if (gantt.hasChild(task.id)) // проверяет наличие дочек
  {

    recountedProgress = 0;
    var len = 0;

    gantt.eachTask(function (task1) // дочки указанной задачи
    {
      if (!gantt.hasChild(task1.id)) // дочки последнего уровня
      {
        len = len + 1; // считаем количество дочек последнего уровня указанной задачи
      }
    },
      task.id);

      gantt.eachTask(function (task1) // дочки указанной задачи
      {
        if (!gantt.hasChild(task1.id)) // дочки последнего уровня
        {

          recountedProgress = recountedProgress + (100 / (task1.ob_plan / task1.ob_fact) / len); // считаем общий прогресс всех дочек
        }
      },
        task.id);
    }

    else
    {
      recountedProgress = 100 / (task.ob_plan / task.ob_fact); // считаем прогресс

    }

    recountedProgress = Math.floor(recountedProgress);
    task.progress = recountedProgress / 100; // присваем прогресс
    if(isNaN(recountedProgress))
    {
      recountedProgress = "0";
    }
    return recountedProgress + '%';

  }
/*
  var colHeader = '<div class="gantt_grid_head_cell gantt_grid_head_add" onclick="gantt.createTask()"></div>';
  var	colContent = function (task)
    {
      return ('<i class="fa gantt_button_grid gantt_grid_add fa-database" onclick="clickGridButton(' + task.id + ', \'res\')"></i>' +
        '<i class="fa gantt_button_grid gantt_grid_add fa-plus" onclick="clickGridButton(' + task.id + ', \'add\')"></i>');
    };
*/
gantt.config.columns =
  [// столбцы
    { name: "wbs", label: "№", align: "center", width: 60, resize: true, template: gantt.getWBSCode, resize: true },
    { name: "text", label: "Наименование", width: 410, tree: true, resize: true, template: line_break},
    { name: "start_date", label: "Дата н. факт", align: "center", width: 90, template: myFunc_s_f, resize: true},
    { name: "end_date", label: "Дата ок. факт", align: "center", width: 90, template: myFunc_e_f, resize: true},
    { name: "planned_start", label: "Дата н. план", align: "center", width: 90, template: myFunc_s_p, resize: true},
    { name: "planned_end", label: "Дата ок. план", align: "center", width: 90, template: myFunc_e_p, resize: true},
    { name: "progress", label: "Прогресс", align: "center", width: 70, template: progress_PF },//перевод дробного числа в целое и вычисление процента выполнения
    { name: "responsible", label: "Ответст.", align: "center", width: 70, resize: true },
    { name: "add", label: "  ", align: "center", width: 40, resize: true}
  ];

/*

    function clickGridButton(id, action)
    {
		switch (action)
      {
  			case "res":

        var task = gantt.getTask(id);// достаем задачу

        if(task.resourceOn == undefined)
        {
          if (task.type == "splitTask")
          {
            var res = task.parent;
          }
          else
          {
            var res = id;
          }
          localStorage.setItem("id", res);

          gantt.load("data/" + res);
        }

  				break;
  			case "add":
  				gantt.createTask(null, id);
  				break;
  		}
	}

*/
function line_break(task)  //для вывода текста в несколько строк
{

  if (task.text.length <= 40)
  {
    return task.text;
  }

  var len = task.text.length; //длина передаваемой строки
  var string1s = task.text.slice(0, 50);// промежуточное значение первой строки
  var gap = string1s.lastIndexOf(' ');// позиция последнего пробела промежуточного значения первой строки
  var str1 = task.text.slice(0, gap); // первая строка
  var str2 = task.text.slice(gap, len); // вторая строка

  return "<p class='line_break'>" + str1 + "</p><p class='line_break1'>" + str2 + "</p>"; //вывод
};





gantt.templates.task_text = function (start, end, task) // Наименование задачи %
{
  var recountedProgress; // создаем глобальную переменную прогресса

  if (gantt.hasChild(task.id)) // проверяет наличие дочек
  {

    recountedProgress = 0;
    var len = 0;

    gantt.eachTask(function (task1) // дочки указанной задачи
    {
      if (!gantt.hasChild(task1.id)) // дочки последнего уровня
      {
        len = len + 1; // считаем количество дочек последнего уровня указанной задачи
      }
    },
      task.id);

      gantt.eachTask(function (task1) // дочки указанной задачи
      {
        if (!gantt.hasChild(task1.id)) // дочки последнего уровня
        {
          recountedProgress = recountedProgress + (100 / (task1.ob_plan / task1.ob_fact) / len); // считаем общий прогресс всех дочек
        }
      },
        task.id);
    }

    else
    {
      recountedProgress = 100 / (task.ob_plan / task.ob_fact); // считаем прогресс
    }

    recountedProgress = Math.floor(recountedProgress);
    task.progress = recountedProgress / 100; // присваем прогресс
    if(isNaN(recountedProgress))
    {
      recountedProgress = "0";
    }
    return recountedProgress + '%';
  }





gantt.attachEvent("onTaskLoading", function (task)// Определяет начало и конец
{
  task.planned_start = gantt.date.parseDate(task.planned_start, "xml_date");
  task.planned_end = gantt.date.parseDate(task.planned_end, "xml_date");
  return true;
});

gantt.config.auto_types = false;//автоматически преобразует задачи с подзадачами в проекты и проекты без подзадач обратно в задачи
gantt.config.order_branch = true; // Переупорядочение методом перетаскивания внутри одного уровня дерева
//gantt.config.order_branch_free = true; // Переупорядочение методом перетаскивания в пределах любого уровня дерева
gantt.config.order_branch = "marker"; // применение маркера (красиво) для переупорядочевания задач (загрузка происходит только при отпускании мыши)
gantt.config.work_time = true; //убирает нерабочее время из расчетов




gantt.config.lightbox_additional_height = 800;

gantt.attachEvent("onTaskCreated", function(task)
{
  gantt.resetLightbox();// переопределить наполнение Лайтбокса
  var taskP = gantt.getTask(task.parent);// родитель новой задачи(выбранной задача)
  if (taskP.render == "split") // если нету render, тогда показываем полный лайтбокс
  {
    gantt.config.lightbox.sections = split_lightbox;
      return true;
  }
  else
  {
    gantt.config.lightbox.sections = createProjects;
    return true;
  }


/*
  if ((taskP == "") || (taskP == undefined) || (taskP == null)) // если нет родителя тогда показываем полный лайтбокс
  {
      gantt.config.lightbox.sections = createProjects;
      return true;
  }

  if ((taskP.render == "") || (taskP.render == undefined) || (taskP.render == null)) // если нету render, тогда показываем полный лайтбокс
  {
      gantt.config.lightbox.sections = createProjects;
  }
  else // иначе показываем измененный лайтбокс
  {
      gantt.config.lightbox.sections = split_lightbox;
  };*/
});

gantt.locale.labels.section_periodF = "Период по Факту:"; // определение заголовка лайтбокса
gantt.locale.labels.section_periodP = "Период по Плану:";
gantt.locale.labels.section_responsible = 'Ответственный:<nobr class= "atr">*</nobr>';
gantt.locale.labels.section_dimensionP = "Объем план:";
gantt.locale.labels.section_dimensionF = "Объем факт:";
gantt.locale.labels.section_progress = "Прогресс:";
gantt.locale.labels.section_capacity = "Нагрузка:";
gantt.locale.labels.section_type = "";

var UNASSIGNED_ID = 5;
var WORK_DAY = 8;

gantt.attachEvent("onBeforeLightbox", function(id)
  {
    var task = gantt.getTask(id);

    task.my_template = "<span id='title1'>Объем по плану: </span>" + task.ob_plan
    + "<span id='title2'>Объем по факту: </span>"+ task.ob_fact
    + "<span id='title3'>Прогресс: </span>"+ task.progress * 100 + "%";

    return true;
});

var split_lightbox =
[
  {name:"description", height: 53, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
  {name:"periodF", map_to: "auto", type: "time"},
  {name:"responsible", height: 33, map_to: "responsible", type: "textarea", default_value: "Введите ФИО ответственного"},
  {name:"type", height:28, type:"template", map_to:"my_template"},
  /*
  {name:"dimensionP", height: 33, map_to: "ob_plan", type: "textarea", default_value: "Введите объем по плану"},
  {name:"dimensionF", height: 33, map_to: "ob_fact", type: "textarea", default_value: "Введите объем по факту"},*/
  {name:"capacity", type: "resources", map_to: "capacity", height: 300, options: gantt.serverList("people"), default_value:WORK_DAY, unassigned_value: UNASSIGNED_ID}
];

var createProjects =
[
  {name:"description", height: 53, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
  {name:"periodP", map_to: {start_date: "planned_start", end_date: "planned_end"}, type: "time"},
  {name:"responsible",     height: 33, map_to: "responsible", type: "textarea", default_value: "Введите ФИО ответственного"}
];


var addProjects =
[
  {name:"description", height: 53, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
  {name:"periodP", map_to: {start_date: "planned_start", end_date: "planned_end"}, type: "time"}/*,
  {name:"periodF", map_to: "auto", type: "time"}*/,
  {name:"responsible", height: 33, map_to: "responsible", type: "textarea", default_value: "Введите ФИО ответственного"},
		{
			name: "type", height: 22, map_to: "type", type: "radio",
			options: [
          {key: 1, label: "    Проект    "},
          {key: 2, label: "    Задача    "}
      ], default_value: 1,
			onchange: function() {
				console.log("radio switched");
			}
		}/*,

  {name:"dimensionP", height: 33, map_to: "ob_plan", type: "textarea", default_value: "Введите объем по плану"},
  {name:"dimensionF", height: 33, map_to: "ob_fact", type: "textarea", default_value: "Введите объем по факту"}*/
];
