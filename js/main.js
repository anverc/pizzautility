Math.logBase = function(x, y) {
    return Math.log(x) / Math.log(y);
};

Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
  var value = this.getItem(key);
  return value && JSON.parse(value);
}

Date.prototype.valid = function() {
  return isFinite(this);
}

String.prototype.format = String.prototype.f = function() {
  var s = this,
  i = arguments.length;

  while (i--) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
  }
  return s;
};

Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*3600000)); 
   return this;   
}

Date.prototype.addTime = function(m) {    
   this.setTime(this.getTime() + m); 
   return this;   
}

Number.prototype.fHHMMSS = function() {
      var milliseconds = this,
          seconds = parseInt((milliseconds/1000)%60)
          minutes = parseInt((milliseconds/(1000*60))%60)
          hours = parseInt((milliseconds/(1000*60*60)));
      
      var hourst = hours.toString(),
          minst = ("0" + minutes.toString()).slice(-2),
          secst = ("0" + seconds.toString()).slice(-2);
      if (hours < 10) {
        hourst = "0" + hourst;
      }
      return hourst + ":" + minst + ":" + secst;
}

Date.prototype.ssdString = function() {
  var fullhours = this.getHours(),
      hours = (fullhours == 0) ? 12 : ((fullhours <= 12) ? fullhours : (fullhours - 12)),
      ap = (fullhours < 12) ? 'A' : 'P';
      return (this.getFullYear()+"-"+
                ("0" + (this.getMonth() + 1)).slice(-2)+"-"+
                ("0" + this.getDate()).slice(-2)+" "+
                ("0" + hours).slice(-2)+":"+
                ("0" + this.getMinutes()).slice(-2)+
                ap);
  
};

String.prototype.ssdToDate = function() {
  var matches = /(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{2})([APap])/g.exec(this);
  if (matches == null || matches.length != 7) { return null; }
  
  var hours = parseInt(matches[4]);
  if (hours == 12 && matches[6].toUpperCase() == 'A') { hours = 0; }
  else if (hours != 12 && matches[6].toUpperCase() == 'P') { hours = hours + 12; }
    
    var year = matches[1],
        month = matches[2] - 1,
        day = matches[3],
        minutes = matches[5];
    
  return new Date(year, month, day, hours, minutes, 0, 0);
};

Array.prototype.clone = function() {
	return this.slice(0);
};

Math.toCelcius = function(fahrenheit) {
  return ((fahrenheit - 32) / 1.8);
};

Math.toFahrenheit = function(celcius) {
  return ((celcius * 1.8) + 32);
};


var PizzaUtils = PizzaUtils || {};


$(document).ready(function () {
  for (var key in PizzaUtils) {
   var obj = PizzaUtils[key];
   if(typeof obj.Init === 'function') {
     obj.Init();
   }
  }
  if (localStorage) {
    savedData.load();
    savedData.data.visits = savedData.data.visits + 1;
    savedData.save();

    doughUI.showCurrent();
  }
  
  var timer = setInterval(refreshTime, 1000);
  function refreshTime() {
    // do we have data?
    if (savedData.data.sourdo.pages[0].rows.length > 0)
    {
      // grab the first item and get the time.
      var e = $('div[id^="ssd-sheet-entry"]')[0],
          time = $(e).data('time'),
          row = savedData.data.sourdo.pages[0].rows[$(e).data('rowid')],
          timestamp = row.time.ssdToDate(),
          end = timestamp.addHours(time),
          
          now = new Date();
      var millisecs = (end.getTime() - now.getTime());
      $('#pi-sourdo-main-val-timeremaining').text(millisecs.fHHMMSS());
    }
  }
  
  for (var key in PizzaUtils) {
   var obj = PizzaUtils[key];
   if(typeof obj.Start === 'function') {
     obj.Start();
   }
  }
});


// =============================================================================
// DoughUI

var doughUI = {
  
  showCurrent: function()
  {
    
    //$('#pi-sourdo-page-main').removeClass('hidden');
    $('#pizza-dialog-menu-main').removeClass('hidden');
    $('#loading').addClass('hidden');
    this.registerEvents();
  },
  
  hideAllPages: function() {
      $('#pizza-dialog-menu-main').addClass('hidden');
      $('#pi-sourdo-page-main').addClass('hidden');
      $('#pi-doughcalc-page-main').addClass('hidden');
  },
  
  registerEvents: function()
  {
    $('#ssd-close-menu').click(function() {
      $('#pizza-dialog-menu-main').addClass('hidden');
    });
    
    $('#ssd-open-doughcalc').click(function() {
      doughUI.hideAllPages();
      $('#pi-doughcalc-page-main').removeClass('hidden');
    });
    
    $('#ssd-add-timestamp').click(function() {
      var timestampstring = $('input[name=timestamp]').val(),
          timestamp = (timestampstring).ssdToDate();
      if (timestamp == null || timestamp.valid() == false) {
        alert('You need to enter a valid date/time (YYYY-MM-DD HH:MMA).  click the "now" button to get the current time if you need a better example.');
        return;
      }
      
      var mytemp = $('input[name=degrees]').val(),
          iscelcius = $('#celcius').is(':checked'),
          lowTemp = iscelcius ? Math.toCelcius(35) : 35,
          highTemp = iscelcius ? Math.toCelcius(95) : 95;
      if (mytemp < lowTemp || mytemp > highTemp) {
        alert('The temperature you entered is not supported.  It needs to be between {0} and {1}\xB0{2}'.f(lowTemp, highTemp, (iscelcius) ? 'C' : 'F'));
        return;
      }

      var editid = $('input[name=rowsindex]').val();

      if ($.isNumeric(editid) && editid >= 0) {
        var row = savedData.data.sourdo.pages[0].rows[editid];
        row.time = timestampstring;
        row.temp = mytemp;
        row.celcius = iscelcius;
      }
      else
      {
        savedData.data.sourdo.pages[0].rows.push({
          time: timestampstring,
          temp: mytemp,
          celcius: iscelcius
        });
        editid = (savedData.data.sourdo.pages[0].rows.length - 1);
      }
      savedData.data.sourdo.pages[0].temp = mytemp;
      savedData.data.sourdo.pages[0].celcius = iscelcius;
      savedData.data.celcius = iscelcius;
      savedData.save();
      doughUI.updateTimestampRow(editid);
      doughUI.refreshTimestampRows();
      $('#ssd-inputpage-add-timestamp').addClass('hidden');
    });
    
    $('#pi-sourdo-page-main input[name="reset"]').click(function() {
      savedData.resetSourdo(0);
    });
    
    $('#pi-sourdo-page-main input[name="add-timestamp"]').click(function() {
      doughUI.showAddTimestamp(-1);
    });
    
    $('#ssd-cancel-timestamp').click(function() {
      $('#ssd-inputpage-add-timestamp').addClass('hidden');
    });
    
    $('input[name=now]').click(function() {
      var now = new Date();
      $('input[name=timestamp]').val(now.ssdString());
    });
  },

  showAddTimestamp: function(i)
  {
    if (i != null && i >= 0)
    {
      var rowData = savedData.data.sourdo.pages[0].rows[i];
      $('input[name=rowsindex]').val("{0}".f(i));
      $('input[name=ssd-add-timestamp]').val('edit');
      $('#ssd-add-timestamp-title').text('Edit Timestamp');
      $('input[name=degrees]').val(rowData.temp);
      $('input[name=timestamp]').val(rowData.time);
    }
    else
    {
      $('input[name=rowsindex]').val("-1");
      $('input[name=ssd-add-timestamp]').val('add');
      $('#ssd-add-timestamp-title').text('Add Timestamp');
      $('input[name=timestamp]').val((new Date()).ssdString());
    }
    $('#ssd-inputpage-add-timestamp').removeClass('hidden');
  },
  
  updateTimestampRow: function(i) {
    var newSheetEntry = $('#ssd-sheet-entry{0}'.f(i)),
        dataRow = savedData.data.sourdo.pages[0].rows[i],
        now = new Date(),
        time = dataRow.time.ssdToDate(),
        isNew = false;
    if (newSheetEntry.length == 0)
    {
      isNew = true;
      newSheetEntry = $('#ssd-sheet-etemplate').clone().attr('id', 'ssd-sheet-entry{0}'.f(i)).removeClass('hidden');
      newSheetEntry.data('rowid', i);
    }
    var entry = newSheetEntry.find('.ssd-entry'),
        result = newSheetEntry.find('.ssd-result'),
        entries = $('div[id^="ssd-sheet-entry"]').not(newSheetEntry);
    var $reset_button = $('#pi-sourdo-page-main input[name="reset"]');
        
    //<div id='ssd-sheet-entry1'><div class='ssd-entry'>Jan 1, 2014 09:00P 65&deg;F</div><div class='ssd-result ssd-result-complete'>11 hour ferment. n% complete</div></div>
    entry.text('{0} {1}\xB0{2}'.f(dataRow.time, dataRow.temp, dataRow.celcius ? 'C' : 'F'));
    result.text('{0} hour ferment. {1}% complete');
    if (entries.length > 0) {
      var added = false;
      entries.each(function() {
        var localrowid = $(this).data('rowid'),
            localdataRow = savedData.data.sourdo.pages[0].rows[localrowid],
            localtime = localdataRow.time.ssdToDate();
         if (time > localtime) {
           $(this).before(newSheetEntry);
           added = true;
           return false;
         }
      });
      if (added== false) {
        $reset_button.before(newSheetEntry);
      }
    }
    else {
      $reset_button.before(newSheetEntry);
    }
    if (isNew) {
      entry.on('click', function() {
        var parentid = this.parentNode.id;
        doughUI.showAddTimestamp(parseInt(parentid.match(/(\d+)$/)[0], 10));
      });
    }
  },
  
  refreshTimestampRows: function() {
    // fill in rates for each
    var reverseRows = $($('div[id^="ssd-sheet-entry"]').get().reverse());
    var totalRate = 0.0;
    var totalStageValues = 0.0;
    $.each(reverseRows, function (i, e) {
      var prev = null,
          next = null;
      if (i > 0) { prev = reverseRows[i-1]; }
      if (i + 1 < reverseRows.length) { next = reverseRows[i+1]; }
      
      if (next == null) {
        $(e).removeData('stageValue');
        var row = savedData.data.sourdo.pages[0].rows[$(e).data('rowid')];
        var tempF = row.celcius ? Math.toFahrenheit(row.temp) : row.temp;
        
        var expectedStageTotal = PizzaUtils.Sourdo.GetTotalExpectedStageValues(savedData.data.sourdo.pages[0].starter);
        var stageValue = expectedStageTotal - totalStageValues;
        var millisecs = PizzaUtils.Sourdo.GetStageTime(tempF, stageValue);
        
        var hours = ((millisecs / 1000) / 60 / 60);
        var timestamp = row.time.ssdToDate();
        var end = new Date(timestamp).addTime(millisecs);
        $(e).data('stageValue', stageValue); 
        $(e).data('time', hours);
        $(e).find('.ssd-result').text('{0} ferment required.'.f(millisecs.fHHMMSS()));
        $('#pi-sourdo-main-val-tempremaining').text('{0} \xB0{1}'.f(row.temp, (row.celcius) ? 'C' : 'F'));
        $('#pi-sourdo-main-val-doneby').text('done by {0}'.f(end.toLocaleString()));
      }
      else {
        var row = savedData.data.sourdo.pages[0].rows[$(e).data('rowid')];
        var nextid = $(next).data('rowid');
        var nextRow = savedData.data.sourdo.pages[0].rows[nextid];
        var timestamp = row.time.ssdToDate();
        var nexttimestamp = nextRow.time.ssdToDate();
        var millisecs = (nexttimestamp.getTime() - timestamp.getTime());
        
        var tempF = row.celcius ? Math.toFahrenheit(row.temp) : row.temp;
        var stageValue = PizzaUtils.Sourdo.GetStageValue(millisecs, tempF);
        
        var hours = ((millisecs / 1000) / 60 / 60);
        totalStageValues = totalStageValues + stageValue;
        $(e).data('stageValue', stageValue); 
        $(e).data('time', hours);
        $(e).find('.ssd-result').text('{0} ferment.'.f(millisecs.fHHMMSS()));
      }
    });
    
    
  }
}


// =============================================================================
// Saved Data

var savedData = {
  name: 'savedData',
  dataPageTemplate_sourdo: {
    rows: [], // {time, temp, celcius}
    starter: 0.02
  },
  dataPageTemplate_doughcalc: {
    rows: [], // {ingredient, percent, ingredienttype}
    ballweight: 250,
    ballcount: 4,
    residue: 4.0
  },
  dataTemplate_v0: {
    visits: 0,
    celcius: false,
    temp: 75,
    now: true,
    starter: 0.25,
    rows: [{
      time: (new Date()).ssdString(),
      temp: 75,
      celcius: false
    }, {
      time: (new Date(Date.now() + 100000)).ssdString(),
      temp: 75,
      celcius: false
    }]
  },
  /* version 1
  dataTemplate: {
    version - added
    rows - removed
    now - removed
    temp - removed
    starter - removed
  }
  */
  /* version 2
  dataTemplate: {
    doughcalc - added
  }
  */
  /* version 3
  dataTemplate: {
    doughcalc.rows[*].isstarter - removed
    doughcalc.rows[*].ingredienttype - added
  }
  */
  dataTemplate: {
    version: 3,
    visits: 0,
    celcius: false,
    sourdo: {
      pages: [],
      temp: 75
    },
    doughcalc: {
      pages: []
    }
  },
  data: jQuery.extend(true, {}, this.dataTemplate),
  
  load: function() {
    this.data = localStorage.getObject(this.name);
    this.upgrade();

    $.each(this.data.sourdo.pages[0].rows, function(index, value) {
      doughUI.updateTimestampRow(index);
    });
    doughUI.refreshTimestampRows();
  },
  
  save: function() {
    if (localStorage != null) {
      localStorage.setObject(this.name, this.data);
    }
  },

  upgrade: function() {
    
    /*
    var savedCelcius = this.data.celcius
    this.data = jQuery.extend(true, {}, this.dataTemplate_v0);
    this.data.celcius = savedCelcius;
    this.save();
    */
    
    
    
    if (this.data == null) {
      this.data = jQuery.extend(true, {}, this.dataTemplate);
    }

    // Version 1 - added concept of multiple pages and multiple data sources
    else if (this.data.version == null || this.data.version != this.dataTemplate.version) {
      // for now all we have is normal.
      if (this.data.version == null) {
        this.data.version = this.dataTemplate.version;
        // create a new sourdo page
        this.data.sourdo = jQuery.extend(true, {}, this.dataTemplate.sourdo);
        this.data.sourdo.pages.push(
          jQuery.extend(true, {}, this.dataPageTemplate_sourdo)
        );
        this.data.sourdo.temp = this.data.temp;
        this.data.sourdo.pages[0].rows = this.data.rows.clone();
        this.data.sourdo.pages[0].starter = this.data.starter;
        this.data.rows = null;
        this.data.temp = null;
        this.data.now = null;
        this.data.starter = null;
      }
      else if (this.data.version == 1) {
        this.data.doughcalc = jQuery.extend(true, {}, this.dataTemplate.doughcalc);
      }
      else if (this.data.version == 2 && this.data.doughcalc.rows != null) {
        // removed isflour and replaced with ingredienttype
        var oldData = this.data.doughcalc.rows.slice();
        this.data.doughcalc.rows = [];
        $.each(oldData, function(index, value) {
          var ingredienttype = 'none';
          if (value.isflour) {
            ingredienttype = 'isflour';
          }
          savedData.data.doughcalc.pages[0].rows.push({
            ingredient: value.ingredient,
            percent: value.percent,
            ingredienttype: 'none'
          });
        });
      }
      
      this.data.version = this.dataTemplate.version;
    }
    
    if (savedData.data.sourdo.pages.length == 0) {
      this.data.sourdo.pages.push(
          jQuery.extend(true, {}, this.dataPageTemplate_sourdo)
        );
    }
    
    if (savedData.data.doughcalc.pages.length == 0) {
      this.data.doughcalc.pages.push(
          jQuery.extend(true, {}, this.dataPageTemplate_doughcalc)
        );
    }

    // added ballweight and count but don't need to do a version update
    var passTemplate = this.dataPageTemplate_doughcalc;
    $.each(savedData.data.doughcalc.pages, function(index, value) {
      if (value.ballweight == null || value.ballweight == 0) { value.ballweight = passTemplate.ballweight; }
      if (value.ballcount == null || value.ballcount == 0) { value.ballcount = passTemplate.ballcount; }
      if (value.residue == null) { value.residue = passTemplate.residue; }
    });

    // Version 0.0.0003 - added Celcius/Fahrenheit change
    if (savedData.data.celcius == null)
    {
      this.data.celcius = this.dataTemplate.celcius;
    }
    setupCelcius();

    setupStarter();

    // save changes
    this.save();
  },
  
  addTimestamp: function() {
    
  },
  
  resetdata: function() {
    var savedCelcius = this.data.celcius
    this.data = jQuery.extend(true, {}, this.dataTemplate);
    this.data.celcius = savedCelcius;
    this.save();
    location.reload();
  },
  
  resetSourdo: function(i) {
    this.data.sourdo.pages[i] = jQuery.extend(true, {}, this.dataPageTemplate_sourdo);
    this.save();
    location.reload();
  },
  
  resetDoughcalc: function(i) {
    this.data.doughcalc.pages[i] = jQuery.extend(true, {}, this.dataPageTemplate_doughcalc);
    this.save();
    location.reload();
  }
};


function setupCelcius() {
  $('#celcius').prop('checked', savedData.data.celcius);
  $('#fahrenheit').prop('checked', savedData.data.celcius == false);
  $('#celcius-span').toggleClass('bold', savedData.data.celcius);
  $('#fahrenheit-span').toggleClass('bold', savedData.data.celcius == false);

  $('input[name=celcius]:radio').change(function() {
    savedData.data.celcius = ($(this).val() == 'yes');
    savedData.save();

    $('#celcius-span').toggleClass('bold', savedData.data.celcius);
    $('#fahrenheit-span').toggleClass('bold', savedData.data.celcius == false);
  });
};


function setupStarter() {
  var $starter_input = $('#pi-sourdo-dialog-setpercent input[name="starter"]');
  var $next_button = $('#pi-sourdo-dialog-setpercent input[name="next"]');
  $starter_input.val(savedData.data.sourdo.pages[0].starter * 100);
  $('#pi-sourdo-main-val-starterpct').text($starter_input.val());

  $next_button.click(function() {
    savedData.data.sourdo.pages[0].starter = $starter_input.val() / 100;
    savedData.save();
    $('#pi-sourdo-main-val-starterpct').text($starter_input.val());
    $('#pi-sourdo-dialog-setpercent').addClass('hidden');
    doughUI.showAddTimestamp(-1);
  });
}