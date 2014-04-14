// Namespace
var PizzaUtils = PizzaUtils || {};

PizzaUtils.UI = function()
{
  var showPage = function() {
  };

  var init = function() {
  };
  
  var start = function() {
    var buttons = $('input[name="pn-button-mainmenu"]');
    buttons.val('menu');
    buttons.click(function() {
      $('#pizza-dialog-menu-main').removeClass('hidden');
    });
  };
  
  var addMenuButton = function(menu_name, button_text, callback) {
    var new_button_wrapper = $('#pizza-dialog-menu-main-button-template').clone().removeClass('hidden');
    var new_button = new_button_wrapper.children().filter(":button");
    new_button.val(button_text);
    new_button.click(function() { 
      callback(); 
    });
    new_button_wrapper.insertBefore($('#pizza-dialog-menu-main-footer'));
    //<div><input type='button' name='ssd-open-doughcalc' id='ssd-open-doughcalc' value='dough calculator' class='bluebutton widebutton'/></div>
      
  };

  // define public and private properties.
  var oPublic =
  {
    Init: init,
    Start: start,
    ShowPage: showPage,
    AddMenuButton: addMenuButton
  }; return oPublic;
}();



