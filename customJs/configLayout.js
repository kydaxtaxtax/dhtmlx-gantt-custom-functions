
gantt.config.layout = //Горизонтальная полоса прокрутки на обе части Гната
{
  css: "gantt_container",
  rows:
    [
      {
        cols:
          [
            {
              width: 1009, // Максимальная ширина таблицы (grid)
              min_width: 300, //Минимальная ширина таблицы (grid)
              rows:
                [
                  { view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer" },
                  { view: "scrollbar", id: "gridScroll", group: "horizontal" }
                ]
            },
            { resizer: true, width: 1 },
            {
              rows:
                [
                  { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
                  { view: "scrollbar", id: "scrollHor", group: "horizontal" }
                ]
            },
            { view: "scrollbar", id: "scrollVer" }
          ],

        gravity: 2
      },
      { resizer: true, width: 1, next: "resources" },
      {
        gravity: 1,
        id: "resources",
        config: resourceConfig,
        templates: resourceTemplates,
        cols:
          [
            {
              width: 1009, // Максимальная ширина таблицы (grid)
              min_width: 300, //Минимальная ширина таблицы (grid)
              rows:
                [
                  { view: "resourceGrid", group: "grids", scrollX: "gridScroll", scrollable: true, width: 435, scrollY: "resourceVScroll" }
                ]
            },
            { resizer: true, width: 1 },
            {
              rows:
                [
                  { view: "resourceHistogram", scrollX: "scrollHor", scrollY: "resourceVScroll" }
                ]
            },
            { view: "scrollbar", id: "resourceVScroll", group: "vertical" }
          ]
      }
    ]
};






// if (check_switch_resource == true)
// {
//   gantt.config.layout = //Горизонтальная полоса прокрутки на обе части Гната
//   {
//     css: "gantt_container",
//     rows:
//       [
//         {
//           cols:
//             [
//               {
//                 width: 1009, // Максимальная ширина таблицы (grid)
//                 min_width: 300, //Минимальная ширина таблицы (grid)
//                 rows:
//                   [
//                     { view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer" },
//                     { view: "scrollbar", id: "gridScroll", group: "horizontal" }
//                   ]
//               },
//               { resizer: true, width: 1 },
//               {
//                 rows:
//                   [
//                     { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
//                     { view: "scrollbar", id: "scrollHor", group: "horizontal" }
//                   ]
//               },
//               { view: "scrollbar", id: "scrollVer" }
//             ],
//
//           gravity: 2
//         },
//         { resizer: true, width: 1, next: "resources" },
//         {
//           gravity: 1,
//           id: "resources",
//           config: resourceConfig,
//           templates: resourceTemplates,
//           cols:
//             [
//               {
//                 width: 1009, // Максимальная ширина таблицы (grid)
//                 min_width: 300, //Минимальная ширина таблицы (grid)
//                 rows:
//                   [
//                     { view: "resourceGrid", group: "grids", scrollX: "gridScroll", scrollable: true, width: 435, scrollY: "resourceVScroll" }
//                   ]
//               },
//               { resizer: true, width: 1 },
//               {
//                 rows:
//                   [
//                     { view: "resourceHistogram", scrollX: "scrollHor", scrollY: "resourceVScroll" }
//                   ]
//               },
//               { view: "scrollbar", id: "resourceVScroll", group: "vertical" }
//             ]
//           }
//       ]
//   };
// }
// else
// {
//   gantt.config.layout = //Горизонтальная полоса прокрутки на обе части Гната
//   {
//     css: "gantt_container",
//     rows:
//       [
//         {
//           cols:
//             [
//               {
//                 width: 1009, // Максимальная ширина таблицы (grid)
//                 min_width: 300, //Минимальная ширина таблицы (grid)
//                 rows:
//                   [
//                     { view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer" },
//                     { view: "scrollbar", id: "gridScroll", group: "horizontal" }
//                   ]
//               },
//               { resizer: true, width: 1 },
//               {
//                 rows:
//                   [
//                     { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
//                     { view: "scrollbar", id: "scrollHor", group: "horizontal" }
//                   ]
//               },
//               { view: "scrollbar", id: "scrollVer" }
//             ],
//
//           gravity: 2
//         }
//       ]
//   };
// }
