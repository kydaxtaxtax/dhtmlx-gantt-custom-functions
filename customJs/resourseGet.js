
function getResource(id)
{
  var task = gantt.getTask(id);// достаем задачу
  if(task.resourceOn == undefined)
  {/*
    if (task.type == "splitTask")
    {
      var res = task.parent;
    }
    else
    {*/
      var res = id;
  /*  }*/
    // localStorage.setItem("id", res);
    gantt.load("data/" + res);
    return true;
  }
}


  function redefineEditor(task)
  {

    gantt.resetLightbox();//переопределить наполнение Лайтбокса

    if (task.type == "splitTask")
    {
      gantt.config.lightbox.sections = split_lightbox;
      return true;
    }
      gantt.config.lightbox.project_sections = createProjects;
      return true;
  }



    function showLightbox(id)
    {
      gantt.showLightbox(id);
      return true;
    }

  // lightbox_additional_height
  gantt.attachEvent("onLightboxDelete", function(id)
  {
    // var task = gantt.getTask(id);
    // gantt.selectTask(task.parent);
    return true;
  })


  gantt.attachEvent("onLightboxSave", function(id, task, is_new)
  {
    console.log(task)
    var plan = 0;

    var prog = 0;
    var res = 0;
    var value = 0;
    var n = 0;

    gantt.$resourcesStore.eachItem(function (res)//цикл по элементам resourcesStore
    {
      if (!gantt.$resourcesStore.hasChild(res.id) && res.value != undefined)//проходим по задачм последнего уровня
      {
        n += 1;
      }
    });

    gantt.$resourcesStore.eachItem(function (res)//цикл по элементам resourcesStore
    {
      if (!gantt.$resourcesStore.hasChild(res.id) && res.value != undefined)//проходим по задачм последнего уровня
      {
        var fact = 0;
        task.capacity.forEach(function (item)//проходим по всем задачам
        {

          if(item.resource_id == res.id)
          {
            fact = parseInt(item.value); //если нашли id, тогда перезаписываем факт
            return true;
          }
        });

        prog += fact / res.value * 100;

        plan += res.value;
      }
    });

    console.log(n);
    prog = prog/n;
    fact = plan / 100 * prog;

    var fact = 0;
    if(task.capacity != undefined)
    {
      task.capacity.forEach(function (item)//проходим по всем задачам
      {
        fact += parseInt(item.value);
      });
    }

    task.ob_fact = fact.toFixed(2);
    task.ob_plan = plan.toFixed(2);
    console.log(task.ob_plan);
    // gantt.selectTask(id);
    return true;
  })

  gantt.attachEvent("onLightboxCancel", function(id)
  {
    // gantt.selectTask(id);
    return true;
  })



//-----------------------------------------------------------------------------





  var dblClick;
  gantt.attachEvent("onTaskDblClick", function(id)
  {
    var task = gantt.getTask(id);// достаем задачу
    dblClick = true;
    return false;
  });

gantt.attachEvent("onTaskSelected", function (id)
    {
      var task = gantt.getTask(id);// достаем задачу

      function f(id)
      {
        if (dblClick == true)
        {
          dblClick = false;
          redefineEditor(task);

          if(task.type == "splitTask")
          {
            getResource(id);
            setTimeout(showLightbox, 1000, id);
          }

          else
          {
            gantt.showLightbox(id);
          }
          return true;
        }

        else//для одного клика
        {
          getResource(id);
        }

      return true;

      }
      setTimeout(f, 250, id);

      return true;
    });


//-----------------------------------------------------------------------------



  gantt.attachEvent("onParse", function ()
  {

  });
/*
  gantt.attachEvent("onLoadEnd", function ()//после загрузки ганта возвращаемся на выбранную задачу
  {
      // document.getElementsByClassName("gantt_layout_x")[0].scrollTop = positionVer;
      function fu(){

        let id = localStorage.getItem("id");
        var task = gantt.getTask(id);
        var sizes = gantt.getTaskPosition(task, task.start_date, task.end_date);
        gantt.scrollTo(sizes.left, sizes.top);
        gantt.selectTask(id);
      }
      // setTimeout(fu,1000);
      fu();

  });
*/
  //gantt.init("gantt_here");
/*
  gantt.attachEvent("onTaskSelected", function(id)//после выбора задачи смотрим ее с начала шкалы
  {

      function fu(){
        let id = localStorage.getItem("id");
        var task = gantt.getTask(id);
        var sizes = gantt.getTaskPosition(task, task.start_date, task.end_date);
        gantt.scrollTo(sizes.left, sizes.top);
        gantt.selectTask(id);
      }
      setTimeout(fu(),1000);

  });
*/
