// Namespace
var PizzaUtils = PizzaUtils || {};

PizzaUtils.Sourdo = function()
{
  var logOnePercent = Math.log(0.01);
  var logFourtyPercent = Math.log(0.40);
  var tempScalerDivisor = Math.log(40.00) / Math.log(2.00);

  var init = function() {
  };
  var start = function() {
    PizzaUtils.UI.AddMenuButton("main", "Sourdough Fermintation Timer", PizzaUtils.Sourdo.ShowPage);
  };
  
  var showPage = function() {
    doughUI.hideAllPages();
    $('#pi-sourdo-page-main').removeClass('hidden');

    if (savedData.data.sourdo.pages[0].rows.length == 0)
    {
      $('#pi-sourdo-dialog-setpercent').removeClass('hidden');
    }

  };

  var tempScaler = function(temp) { // row e
    var temp4 = Math.pow(temp,4);
    var temp3 = Math.pow(temp,3);
    var temp2 = Math.pow(temp,2);
    var a = (-121.21668 * temp4 + 37874.84976 * temp3 - 4498554.81852 * temp2 + 241208900.12304 * temp - 4948754596.76304);
    var b = (-13.5828 * temp4 + 4243.905 * temp3 - 504050.15448 * temp2 + 27026056.575 * temp - 554467731.75396);
    var c = (-121.21668 * temp4 + 37874.84976 * temp3 - 4498554.81852 * temp2 + 241208900.12304 * temp - 4948754596.76304);
    var d = (-13.5828 * temp4 + 4243.905 * temp3 - 504050.15448 * temp2 + 27026056.575 * temp  - 554467731.75396);
    return (((a * logOnePercent + b) - (c * logFourtyPercent + d)) / (tempScalerDivisor));
  };

  var getStageValue = function(time, temp) {
    return time / tempScaler(temp);
  };
  
  var getStageTime = function(temp, stageValue) {
    return tempScaler(temp) * stageValue;
  };

  var getPercentStarterRequired = function(totalStageValue) { // d16 with only 1 time/temp
    return 0.894 / Math.pow(2, totalStageValue);
  };

  var getTotalExpectedStageValues = function(starterPercent) { // f15 (what you get if you add all stage values together
    return Math.logBase((0.894 / starterPercent), 2);
  };

  // define public and private properties.
  var oPublic =
  {
    Init: init,
    Start: start,
    ShowPage: showPage,
    GetStageValue: getStageValue,
    GetTotalExpectedStageValues: getTotalExpectedStageValues,
    GetStageTime: getStageTime
  }; return oPublic;
}();
