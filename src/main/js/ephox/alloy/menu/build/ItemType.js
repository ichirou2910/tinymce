define(
  'ephox.alloy.menu.build.ItemType',

  [
    'ephox.alloy.api.SystemEvents',
    'ephox.alloy.behaviour.Behaviour',
    'ephox.alloy.construct.EventHandler',
    'ephox.alloy.menu.util.ItemEvents',
    'ephox.alloy.menu.util.MenuMarkers',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.peanut.Fun'
  ],

  function (SystemEvents, Behaviour, EventHandler, ItemEvents, MenuMarkers, FieldPresence, FieldSchema, Fun) {
    var schema = [
      FieldSchema.strict('value'),
      FieldSchema.strict('dom'),
      FieldSchema.field(
        'markers',
        'markers',
        FieldPresence.strict(),
        MenuMarkers.itemSchema()
      ),
      FieldSchema.state('builder', function () {
        return builder;
      })
    ];

    var builder = function (info) {
      return {
        uiType: 'custom',
        dom: info.dom(),
        focusing: {
          onFocus: function (component) {
            ItemEvents.onFocus(component);
          }
        },
        events: {
          'click': EventHandler.nu({
            run: function (component) {
              var target = component.element();
              component.getSystem().triggerEvent(SystemEvents.execute(), target, {
                target: Fun.constant(target)
              });
            }
          }),
          'mouseover': ItemEvents.hoverHandler
        },
        keying: {
          mode: 'execution'
        },
        representing: {
          query: function () {
            return info.value();
          },
          set: function () { }
        },
        behaviours: [
          Behaviour.exhibition('exhibition.menu.item.type', {
            classes: [ info.markers().item() ]
          })
        ]
      };
    };

    return schema;
  }
);