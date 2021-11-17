
gantt.locale.labels.section_priority = "Priority";

gantt.config.xml_date = "%Y-%m-%d %H:%i:%s"; // формат вводимой даты
gantt.config.task_height = 24; // высота задачи по факту
gantt.config.row_height = 48; // высота строки 48

gantt.locale.labels.section_periodF = "Период по Факту:"; // определение заголовка лайтбокса
gantt.locale.labels.section_periodP = "Период по Плану:";
gantt.locale.labels.section_responsible = 'Ответственный:<nobr class= "atr">*</nobr>';
gantt.locale.labels.section_dimensionP = 'Объем план:<nobr class= "atr">*</nobr>';
gantt.locale.labels.section_dimensionF = 'Объем факт:<nobr class= "atr">*</nobr>';
gantt.locale.labels.section_progress = "Прогресс:";
gantt.locale.labels.section_capacity = "Нагрузка:";


gantt.attachEvent("onLightboxSave", function(id, task, is_new)// при нажатии на кнопку сохранить в форме редактирования
{

  var fP = task.ob_plan / task.ob_fact;
  if(isNaN(fP))
  {
    gantt.message({type:"myCssG", text:"Некорректно ведены объемы"});//проверка объема по факту
    return false;
  }

  if((fP < 1))
  {
    gantt.message({type:"myCssG", text:"Некорректно введен объем по факту"});//проверка объема по факту
    return false;
  }

  if(task.type = "task")//для типа "задача"
  {
    if(!task.responsible){
      gantt.message({type:"myCssG", text:"Введите ответственного"});//проверка ответственного
    }
    if(!task.ob_plan){
      gantt.message({type:"myCssG", text:"Введите объем по плану"});//проверка объема по плану
    }
    if(!task.ob_fact){
      gantt.message({type:"myCssG", text:"Введите объем по факту"});//проверка объема по факту
    }

    if(!task.ob_fact || !task.ob_plan || !task.responsible)//если хотя бы одно поле не введено, тогда не сохраняем
    {
      return false;
    }
    else(task.ob_fact && task.ob_plan && task.responsible)//если все поля введены, тогда сохраняем
    {
      return true;
    }
  }

  if(task.type = "project")//для типа "проект"
  {
    if(!task.responsible){
      gantt.message({type:"myCssG", text:"Введите ответственного"});//проверка ответственного
    }

    if(!task.responsible)//если поле не введено, тогда не сохраняем
    {
      return false;
    }
    else(task.responsible)//если поле введено, тогда сохраняем
    {
      return true;
    }
  }

  if((task.type == "") || (task.type == undefined) || (task.type == null))//для неопределенного типа
  {
    gantt.message({type:"myCssG", text:"Не введен тип задачи(обратитесь к разработчикам)"});
    return false;
  }
    return true;
})

gantt.attachEvent("onBeforeLightbox", function(id, task)
{
    var task = gantt.getTask(id);

    if((task.users == "") || (task.users == undefined) || (task.users == null))
    {
      task.my_template = "введите объем ";
    }
    else
    {
      task.my_template = value + " %";
    }


    return true;
});

gantt.config.lightbox.sections =
[
  {name:"description", height: 53, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
  {name:"periodP", map_to: {start_date: "planned_start", end_date: "planned_end"}, type: "time"},
  {name:"periodF", map_to: "auto", type: "time"},
  {name:"responsible", height: 33, map_to: "responsible", type: "textarea", default_value: "Введите ФИО ответственного"},
  {name:"dimensionP", height: 33, map_to: "ob_plan", type: "textarea", default_value: "Введите объем по плану"},
  {name:"dimensionF", height: 33, map_to: "ob_fact", type: "textarea", default_value: "Введите объем по факту"},
];

gantt.config.lightbox.project_sections =
[
  {name:"description", height: 53, map_to: "text", type: "textarea", focus: true, default_value: "Введите название задачи"},
  {name:"periodP", map_to: {start_date: "planned_start", end_date: "planned_end"}, type: "time"},
  {name:"periodF", map_to: "auto", type: "time"},
  {name:"responsible",     height: 33, map_to: "responsible", type: "textarea", default_value: "Введите ФИО ответственного"}
];

gantt.addTaskLayer({// редактирование задач по плану
  renderer: {
    render: function draw_planned(task) {
      if (task.planned_start && task.planned_end) {
        var sizes = gantt.getTaskPosition(task, task.planned_start, task.planned_end);
        var el = document.createElement('div');
        el.className = 'baseline';
        el.style.left = sizes.left + 'px';
        el.style.width = sizes.width + 'px';
        el.style.height = 32 + 'px';
        el.style.top = sizes.top + gantt.config.task_height + -9 + 'px';//отступ плана от факта
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

gantt.templates.task_class = function (start, end, task) {
  if (task.planned_end) {
    var classes = ['has-baseline'];
    if (end.getTime() > task.planned_end.getTime()) {
      classes.push('overdue');
    }
    return classes.join(' ');
  }
};

gantt.templates.rightside_text = function (start, end, task) //подсчет "Превышения"
{
  if (task.planned_end) {
    if (end.getTime() > task.planned_end.getTime()) {
      var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
      var text = "<p>Превышение: " + overdue + " д.</p>";
      return text;
    }
  }
};

gantt.config.sort = true; // сортировка
gantt.config.work_time = true; //позволяет рассчитывать продолжительность задач в рабочее время вместо календарного
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
  return "task_row_class";
};

gantt.templates.grid_row_class = function(start, end, task)// Класс для строки таблицы
{
    return "grid_row_class";
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
gantt.config.fit_tasks = true; //автоматическое расширение шкалы времени

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

gantt.config.duration_unit = "day";// Устанавливает единицу длительности задачи

var formatFunc = gantt.date.date_to_str("%d-%m-%Y");//Формат отображаемой даты

var textEditor = { type: "text", map_to: "text" };
var dateEditor1 = { type: "date", map_to: "start_date" };
var dateEditor2 = { type: "date", map_to: "end_date" };
var dateEditor3 = { type: "date", map_to: "planned_start" };
var dateEditor4 = { type: "date", map_to: "planned_end" };
var durationEditor = { type: "number", map_to: "progress" };

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


gantt.config.columns =
  [// столбцы
    { name: "wbs", label: "№", align: "center", width: 60, resize: true, template: gantt.getWBSCode, resize: true },
    { name: "text", label: "Наименование", width: 410, tree: true, resize: true, template: line_break, editor: textEditor },
    { name: "start_date", label: "Дата н. факт", align: "center", width: 90, template: myFunc_s_f, resize: true, editor: dateEditor1 },
    { name: "end_date", label: "Дата ок. факт", align: "center", width: 90, template: myFunc_e_f, resize: true, editor: dateEditor2 },
    { name: "planned_start", label: "Дата н. план", align: "center", width: 90, template: myFunc_s_p, resize: true, editor: dateEditor3 },
    { name: "planned_end", label: "Дата ок. план", align: "center", width: 90, template: myFunc_e_p, resize: true, editor: dateEditor4 },
    { name: "progress", label: "Прогресс", align: "center", width: 70, template: progress_PF },
    { name: "responsible", label: "Ответст.", align: "center", width: 70, resize: true },
    { name: "add", label: "  ", align: "center", width: 40, resize: true }
  ];


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


function myFunc_s_f(task) {
  var tta = Math.round(100 / (task.ob_plan / task.ob_fact));
  if (100 > tta > 0) {
    return formatFunc(task.start_date);
  }
  return "<div class='not_active'>" + formatFunc(task.start_date) + "</div>";
}

function myFunc_e_f(task) {
  var tta = Math.round(100 / (task.ob_plan / task.ob_fact));
  if (100 > tta > 0) {
    return formatFunc(task.end_date);
  }
  return "<div class='not_active'>" + formatFunc(task.end_date) + "</div>";
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

    gantt.eachTask(function (task) // дочки указанной задачи
    {
      if (!gantt.hasChild(task.id)) // дочки последнего уровня
      {
        len = len + 1; // считаем количество дочек последнего уровня указанной задачи
      }
    },
      task.id);

    gantt.eachTask(function (task) // дочки указанной задачи
    {
      if (!gantt.hasChild(task.id)) // дочки последнего уровня
      {
        var task1 = gantt.getTask(task.id); // объект дочки

        if ((task1.ob_plan == null) || (task1.ob_plan == undefined) || (task1.ob_plan == 0)) // проверка объема по плану на неопределенность
        {
          task1.ob_plan = 100; // считаем количество дочек последнего уровня указанной задачи
        }
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

    gantt.templates.task_text = function (start, end, task) // Наименование задачи %
    {
      return Math.floor(task.progress * 100) + "%";
    }
  return recountedProgress + '%';
}

gantt.config.auto_types = true;// автоматически преобразует задачи с подзадачами в проекты и проекты без подзадач обратно в задачи

gantt.attachEvent("onTaskLoading", function (task)// Определяет начало и конец
{

  task.planned_start = gantt.date.parseDate(task.planned_start, "xml_date");
  task.planned_end = gantt.date.parseDate(task.planned_end, "xml_date");
  return true;
});

gantt.config.order_branch = true; // Переупорядочение методом перетаскивания внутри одного уровня дерева
gantt.config.order_branch_free = true; // Переупорядочение методом перетаскивания в пределах любого уровня дерева
gantt.config.order_branch = "marker"; // применение маркера (красиво) для переупорядочевания задач (загрузка происходит только при отпускании мыши)
