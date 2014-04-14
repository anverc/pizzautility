// Namespace
var PizzaUtils = PizzaUtils || {};

PizzaUtils.DoughCalc = function()
{
  var showAddIngredient = function(i) {
    if (i != null && i >= 0)
    {
      var rowData = savedData.data.doughcalc.pages[0].rows[i];
      $('#pi-doughcalc-dialog-addingredient input[name="rowsindex"]').val("{0}".f(i));
      $('#pi-doughcalc-dialog-addingredient input[name="add-ingredient"]').val('edit');
      $('#pi-doughcalc-dialog-addingredient-title').text('Edit Ingredient');
      $('#pi-doughcalc-dialog-addingredient input[name="ingredient"]').val(rowData.ingredient);
      $('#pi-doughcalc-dialog-addingredient input[name="percent"]').val(rowData.percent);
      $('#pi-doughcalc-dialog-addingredient-ingredienttype').val(rowData.ingredienttype == null ? 'none' : rowData.ingredienttype);
    }
    else
    {
      $('#pi-doughcalc-dialog-addingredient input[name=rowsindex]').val("-1");
      $('#pi-doughcalc-dialog-addingredient input[name="add-ingredient"]').val('add');
      $('#pi-doughcalc-dialog-addingredient-title').text('Add Ingredient');
      $('#pi-doughcalc-dialog-addingredient input[name="ingredient"]').val('');
      $('#pi-doughcalc-dialog-addingredient input[name="percent"]').val(0);
      $('#pi-doughcalc-dialog-addingredient-ingredienttype').val('none');
    }
    //$('#pi-doughcalc-dialog-addingredient [name="weight-type"]').selectmenu('refresh');
    $('#pi-doughcalc-dialog-addingredient').removeClass('hidden');
  }; // showAddIngredient(i)
  
  var showModifySize = function() {
    var page = savedData.data.doughcalc.pages[0];
    $('#pi-doughcalc-dialog-modifysize input[name=ballweight]').val(page.ballweight);
    $('#pi-doughcalc-dialog-modifysize input[name=balls]').val(page.ballcount);
    $('#pi-doughcalc-dialog-modifysize input[name=residuepercent]').val(page.residue);
    $('#pi-doughcalc-dialog-modifysize').removeClass('hidden');
  }; // showModifySize()
  
  var saveModifySize = function() {
    var ballweight = parseFloat($('#pi-doughcalc-dialog-modifysize input[name="ballweight"]').val());
    var balls = parseInt($('#pi-doughcalc-dialog-modifysize input[name="balls"]').val());
    var residue = parseFloat($('#pi-doughcalc-dialog-modifysize input[name="residuepercent"]').val());
    
    if (ballweight <= 0 || balls <= 0) {
      alert('You need to specify a ballweight or the number of balls');
      return false;
    }
    
    var page = savedData.data.doughcalc.pages[0];
    page.ballweight = ballweight;
    $('#pi-doughcalc-page-main-desired').find('.desired-weight').text("{0} g per ball".f(ballweight));
    page.ballcount = balls;
    $('#pi-doughcalc-page-main-desired').find('.desired-count').text("{0} balls".f(balls));
    page.residue = residue;
    $('#pi-doughcalc-page-main-desired').find('.desired-residue').text("{0}% residue".f(residue));

    // set any values that need to be set for this page
    refreshDesiredOutcome();
    
    // save
    savedData.save();

    // hide the dialog
    $('#pi-doughcalc-dialog-modifysize').addClass('hidden');
  }
  
  var addIngredient = function() {
    var rowindex = $('#pi-doughcalc-dialog-addingredient input[name="rowsindex"]').val();
    var ingredient = $('#pi-doughcalc-dialog-addingredient input[name="ingredient"]').val();
    var ingredienttype =  $('#pi-doughcalc-dialog-addingredient-ingredienttype').val();
    var isflour = (ingredienttype == 'isflour');
    var isstarter = (ingredienttype == 'isstarter');
    var iswater = (ingredienttype == 'iswater');
    var percent = parseFloat($('#pi-doughcalc-dialog-addingredient input[name="percent"]').val());

    if (ingredient == '' || ingredient == 'ingredient name') {
        alert('You need to enter a valid ingredient name.');
        return;
    }

    if ($.isNumeric(rowindex) && rowindex >= 0) {
      var row = savedData.data.doughcalc.pages[0].rows[rowindex];
      row.ingredient = ingredient;
      row.percent = percent;
      row.ingredienttype = ingredienttype;
    }
    else
    {
      savedData.data.doughcalc.pages[0].rows.push({
        ingredient: ingredient,
        percent: percent,
        ingredienttype: ingredienttype
      });
      rowindex = (savedData.data.doughcalc.pages[0].rows.length - 1);
    }
    updateIngredientRowUI(rowindex);
    
    // set any values that need to be set for this page
    refreshDesiredOutcome();
    
    // save
    savedData.save();

    // hide the dialog
    $('#pi-doughcalc-dialog-addingredient').addClass('hidden');
  }; // addIngredient()
  
  var updateIngredientRowUI = function(i) {
    var $ingredient = $('#pi-doughcalc-page-main-ingredient-id{0}'.f(i));
    var dataRow = savedData.data.doughcalc.pages[0].rows[i];
    var isNew = false;

    // create the element if it doesn't already exist
    if ($ingredient.length == 0)
    {
      isNew = true;
      $ingredient = $('#pi-doughcalc-page-main-ingredient-template').clone().attr('id', 'pi-doughcalc-page-main-ingredient-id{0}'.f(i)).removeClass('hidden');
      $ingredient.data('rowindex', i);
    }

    var $measurement = $ingredient.find('.ingredient-measurement');
    var $percent = $ingredient.find('.ingredient-percent');
    var $name = $ingredient.find('.ingredient-name');

    var $otherIngredients = $('div[id^="pi-doughcalc-page-main-ingredient-id"]').not($ingredient);

    $name.text(dataRow.ingredient);
    if (dataRow.ingredienttype == 'isflour') {
      $name.append(' <span class="red">*</span>');
    }
    else if (dataRow.ingredienttype == 'isstarter') {
      $name.append(' <span class="orange">*</span>');
    }
    else if (dataRow.ingredienttype == 'iswater') {
      $name.append(' <span class="blue">*</span>');
    }
    $percent.text('{0}%'.f(dataRow.percent));
    $measurement.text('...');

    if ($otherIngredients.length > 0) {
      var added = false;
      $otherIngredients.each(function() {
        var localrowindex = $(this).data('rowindex');
        var localdataRow = savedData.data.doughcalc.pages[0].rows[localrowindex];
        if (dataRow.ingredienttype == 'isflour') {
          // put above non-flours or flours at smaller percents
          if (localdataRow.ingredienttype != 'isflour' || localdataRow.percent < dataRow.percent) {
            $(this).before($ingredient);
            added = true;
            return false; // stop looping 'each'
          }
        }
        else if (localdataRow.ingredienttype != 'isflour' && localdataRow.percent < dataRow.percent) {
          $(this).before($ingredient);
          added = true;
          return false; // stop looping 'each'
        }
      });
      if (added == false) {
        $('#pi-doughcalc-page-main-ingredients-end').before($ingredient);
      }
    }
    else {
      $('#pi-doughcalc-page-main-ingredients-end').before($ingredient);
    }
    if (isNew) {
      $ingredient.on('click', function() {
        var parentid = this.id;
        PizzaUtils.DoughCalc.ShowAddIngredient(parseInt(parentid.match(/(\d+)$/)[0], 10));
      });
    }
  }; // updateIngredientRowUI(i)

  var refreshDesiredOutcome = function() {

    // first, add all the flours
    var ballweight = savedData.data.doughcalc.pages[0].ballweight;
    var ballcount = savedData.data.doughcalc.pages[0].ballcount;
    var residue = savedData.data.doughcalc.pages[0].residue;
    var remainingFlour = 100.0;
    var nonFlourPercent = 0.0;
    var starterWeight = 0.0;

    $.each(savedData.data.doughcalc.pages[0].rows, function(index, value) {
      if (value.ingredienttype == 'isflour') {
        remainingFlour = remainingFlour - value.percent;
      }
      else if (value.ingredienttype == 'isstarter') {
        //nonFlourPercent = nonFlourPercent + value.percent; // todo: fix
        starterWeight = value.percent;
      }
      else {
        nonFlourPercent = nonFlourPercent + value.percent;
      }
    });
    

    var totalWeight = (ballweight * ballcount); // need to add residue later
    var totalFlourWeight = totalWeight / (1.0 + (nonFlourPercent / 100));
    var totalWeight = totalWeight + (totalFlourWeight * (residue / 100)); // add in residue
    starterWeight = ((starterWeight / 100) * totalFlourWeight);

    var $ingredients = $('div[id^="pi-doughcalc-page-main-ingredient-id"]');
    
    var reducedFlour = false;
    var reducedWater = false;
    
    $ingredients.each(function() {
      var rowindex = $(this).data('rowindex');
      var dataRow = savedData.data.doughcalc.pages[0].rows[rowindex];
      
      var measurement = ((dataRow.percent / 100) * totalFlourWeight);
      var measurement = (1.0 + (residue / 100.0)) * measurement;
      
      
      if (Math.round(measurement) !== measurement) {
        measurement = measurement.toFixed(2);
      }
      if (dataRow.ingredienttype == 'isflour') {
        if (starterWeight > 0.0 && reducedFlour == false && starterWeight < measurement)
        {
          measurement = measurement - (starterWeight / 2);
          if (Math.round(measurement) !== measurement) {
            measurement = measurement.toFixed(2);
          }
          reducedFlour = true;
        }
        $(this).find('.ingredient-measurement').text('{0}g**'.f(measurement));
      }
      else if (dataRow.ingredienttype == 'isstarter') {
        $(this).find('.ingredient-measurement').text('{0}g'.f(measurement));
      }
      else if (dataRow.ingredienttype == 'iswater') {
        if (starterWeight > 0.0 && reducedWater == false && starterWeight < measurement)
        {
          measurement = measurement - (starterWeight / 2);
          if (Math.round(measurement) !== measurement) {
            measurement = measurement.toFixed(2);
          }
          reducedWater = true;
        }
        $(this).find('.ingredient-measurement').text('{0}g**'.f(measurement));
      }
      else {
        $(this).find('.ingredient-measurement').text('{0}g'.f(measurement));
      }
    });

    $('#pi-doughcalc-page-main-ingredients-errors').empty();
   if (remainingFlour > 0) {
    $('#pi-doughcalc-page-main-ingredients-errors').append('<b>Note</b>: {0}% flour is not compensated for, <u>something might be wrong with your recipe</u>'.f(remainingFlour));
   }
   else if (remainingFlour < 0) {
    $('#pi-doughcalc-page-main-ingredients-errors').append('<b>Note</b>: flour is over by {0}%, <u>something might be wrong with your recipe</u>'.f(remainingFlour * -1));
   }
   else {
   }

  }; // refreshDesiredOutcome()

  var init = function() {
    $('#pi-doughcalc-page-main input[name="add-ingredient"]').click(function() {
      showAddIngredient(-1);
    });
    
    $('#pi-doughcalc-page-main-desired').click(function() {
      showModifySize();
    });

    $('#pi-doughcalc-dialog-addingredient input[name="add-ingredient"]').click(function() {
      addIngredient();
    });

    $('#pi-doughcalc-dialog-addingredient input[name="cancel-ingredient"]').click(function() {
      $('#pi-doughcalc-dialog-addingredient').addClass('hidden');
    });

    $('#pi-doughcalc-dialog-modifysize input[name="save-modifysize"]').click(function() {
      saveModifySize();
    });

    $('#pi-doughcalc-dialog-modifysize input[name="cancel-modifysize"]').click(function() {
      $('#pi-doughcalc-dialog-modifysize').addClass('hidden');
    });
    
    $('#pi-doughcalc-page-main input[name="doughcalc-reset"]').click(function() {
      savedData.resetDoughcalc(0);
    });
    
  }; // init()

  var start = function() {
    PizzaUtils.UI.AddMenuButton("main", "Dough Percents Calculator", PizzaUtils.DoughCalc.ShowPage);
  }; // start()

  var showPage = function() {
    doughUI.hideAllPages();

    // delete previously viewed page data
    $('div[id^="pi-doughcalc-page-main-ingredient-id"]').remove();
    
    // fill in this page's data
    var page = savedData.data.doughcalc.pages[0];
    $('#pi-doughcalc-page-main-desired').find('.desired-weight').text("{0} g per ball".f(page.ballweight));
    $('#pi-doughcalc-page-main-desired').find('.desired-count').text("{0} balls".f(page.ballcount));
    $('#pi-doughcalc-page-main-desired').find('.desired-residue').text("{0}% residue".f(page.residue));
    
    $.each(page.rows, function(index, value) {
      updateIngredientRowUI(index);
    });

    refreshDesiredOutcome();

    $('#pi-doughcalc-page-main').removeClass('hidden');
  }; // showPage()

  // define public and private properties.
  var oPublic =
  {
    Init: init,
    Start: start,
    ShowPage: showPage,
    ShowAddIngredient: showAddIngredient
  }; return oPublic;
}();
