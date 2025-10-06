//=============================================================================
// EGP_DateTimeSystem.js
//=============================================================================

var Imported = Imported || {};
Imported.EGP_DateTimeSystem = true;

var EricG = EricG || {};
EricG.DateTime = EricG.DateTime || {};
EricG.DateTime.version = 1.0;


/*:
 * @target MZ
 * @plugindesc EGP_DateTimeSystem - Tracks in-game date and time stages, and shows a display window. 
 * @author EricG
 * 
 * @help EGPMZ_DateTimeSystem.js
 * 
 * This plugin provides a simple date and time stage tracking system. 
 * 
 * It allows you to set and advance the date and time stages, and displays 
 * the current date and stage in the upper-left corner of the screen.
 * 
 * The date and stage will be saved in the save file.
 * 
 * ==========================================================================
 * Plugin Parameters
 * ==========================================================================
 * - StartDate  
 *   # The initial date in YYYY-MM-DD format.
 * - Stages     
 *   # A list of stages in one day, separated by commas 
 *   # (e.g. "Morning,Noon,Afternoon").
 * - DateFormatStr    
 *   # The date format string that helps format the date to string 
 *   # (e.g. {YYYY}-{MM}-{DD}).
 * - DateVariableID
 *   # The game variable ID that stores the current date as a string.
 * - StageVariableID
 *   # The game variable ID that stores the current stage index (0-based).
 * 
 * ==========================================================================
 * Plugin Command
 * ==========================================================================
 *  - show                
 *    # Show the date and stage sprite in the upper-left corner.
 *  - hide                
 *    # Hide the date and stage sprite.
 *  - setDate 2025-05-01  
 *    # Set current date to specific date (in YYYY-MM-DD format).
 *  - setStage 1          
 *    # Set current stage to specific index (0-based). 
 *  - advanceDays 5       
 *    # Advance the date to the next X days. 
 *  - advanceStages 2     
 *    # Advance the stage to the next X stages.
 *  - nextDay             
 *    # Advance the date to the next day.
 *  - nextStage           
 *    # Advance the stage to the next one (e.g. from Morning to Noon).
 *
 * @param StartDate
 * @desc The initial date in YYYY-MM-DD format.
 * @default 2025-01-01
 *
 * @param Stages
 * @desc A list of stages in one day, separated by commas (e.g. "Morning,Noon,Afternoon").
 * @default Morning,Noon,Afternoon
 * 
 * @param DateFormatStr
 * @desc The date format string that helps format the date to string (e.g. {YYYY}-{MM}-{DD}).
 * @default {YYYY}-{MM}-{DD}
 *
 * @param ShowWeekDay
 * @type boolean
 * @on Show
 * @off Hide
 * @default false
 * @desc Whether to show the weekday name in the date display.
 *
 * @param WeekDayNames
 * @desc A list of weekday names (start at Sunday), separated by commas (e.g. "Sun,Mon,Tue,Wed,Thu,Fri,Sat").
 * @type string
 * @default Sun,Mon,Tue,Wed,Thu,Fri,Sat
 *
 * @param DateVariableID
 * @type variable
 * @desc The game variable ID that stores the current date as a string.
 * @default 0
 *
 * @param WeekDayVariableID
 * @type variable
 * @desc The game variable ID that stores the current weekday index (0=Sun, 1=Mon, ..., 6=Sat).
 * @default 0
 *
 * @param StageVariableID
 * @type variable
 * @desc The game variable ID that stores the current stage index (0-based).
 * @default 0
 * 
 * @command show
 * @text Show
 * @desc Show the date and stage sprite in the upper-left corner.
 * 
 * @command hide
 * @text Hide
 * @desc Hide the date and stage sprite.
 * 
 * @command setDate
 * @text Set Date
 * @desc Set current date to specific date (in YYYY-MM-DD format).
 * @arg date
 * @type string
 * @default 2025-01-01
 * @desc Date in YYYY-MM-DD format.
 * 
 * @command setStage
 * @text Set Stage
 * @desc Set current stage to specific index (0-based).
 * @arg stageIndex
 * @type number
 * @default 0
 * @desc Stage index you want to set to (0-based).
 * 
 * @command advanceDays
 * @text Advance Days
 * @desc Advance the date to the next X days.
 * @arg days
 * @type number
 * @default 1
 * @desc Number of days to advance.
 * 
 * @command advanceStages
 * @text Advance Stages
 * @desc Advance the stage to the next X stages.
 * @arg stages
 * @type number
 * @default 1
 * @desc Number of stages to advance.
 * 
 * @command nextDay
 * @text Next Day
 * @desc Advance the date to the next day.
 * 
 * @command nextStage  
 * @text Next Stage
 * @desc Advance the stage to the next one (e.g. from Morning to Noon).
 *
 */

(function() {
    const pluginName = "EGPMZ_DateTimeSystem";
    const parameters = PluginManager.parameters(pluginName);
    EricG.DateTime.Param = EricG.DateTime.Param || {};

    EricG.DateTime.Param.StartDateStr = parameters["StartDate"] || "2025-01-01";
    EricG.DateTime.Param.StageList = (parameters["Stages"] || "Morning,Noon,Afternoon").split(',');
    EricG.DateTime.Param.DateFormatStr = parameters["DateFormatStr"] || "{YYYY}-{MM}-{DD}";
    EricG.DateTime.Param.ShowWeekDay = (parameters["ShowWeekDay"] || "false").toLowerCase() === "true";
    EricG.DateTime.Param.WeekDayNames = (parameters["WeekDayNames"] || "Sun,Mon,Tue,Wed,Thu,Fri,Sat").split(',');
    EricG.DateTime.Param.DateVariableID = Number(parameters["DateVariableID"] || 0);
    EricG.DateTime.Param.WeekDayVariableID = Number(parameters["WeekDayVariableID"] || 0);
    EricG.DateTime.Param.StageVariableID = Number(parameters["StageVariableID"] || 0);
    
    // Plugin Commands
    PluginManager.registerCommand(pluginName, "show", args => {
        SceneManager._scene.addChild(EricG.DateTime.getDateDisplaySprite());
        EricG.DateTime.getDateDisplaySprite().refresh();
    });

    PluginManager.registerCommand(pluginName, "hide", args => {
        SceneManager._scene.removeChild(EricG.DateTime.getDateDisplaySprite())
    });
    
    PluginManager.registerCommand(pluginName, "setDate", args => {
        const dateStr = String(args.date);
        EricG.DateTime.setDate(dateStr);
        EricG.DateTime.getDateDisplaySprite().refresh();
        saveDateToVariable();
        saveWeekDayToVariable();
    });

    PluginManager.registerCommand(pluginName, "setStage", args => {
        EricG.DateTime.setStage(parseInt(args.stageIndex));
        EricG.DateTime.getDateDisplaySprite().refresh();
        saveStageToVariable();
    });

    PluginManager.registerCommand(pluginName, "advanceDays", args => {
        EricG.DateTime.advanceDays(parseInt(args.days));
        EricG.DateTime.getDateDisplaySprite().refresh();
        saveDateToVariable();
        saveWeekDayToVariable();
    });

    PluginManager.registerCommand(pluginName, "advanceStages", args => {
        EricG.DateTime.advanceStages(parseInt(args.stages));
        EricG.DateTime.getDateDisplaySprite().refresh();
        saveStageToVariable();
    });

    PluginManager.registerCommand(pluginName, "nextDay", args => {
        EricG.DateTime.nextDay();
        EricG.DateTime.getDateDisplaySprite().refresh();
        saveDateToVariable();
        saveWeekDayToVariable();
    });

    PluginManager.registerCommand(pluginName, "nextStage", args => {
        EricG.DateTime.nextStage();
        EricG.DateTime.getDateDisplaySprite().refresh();
        saveStageToVariable();
    });

    function saveDateToVariable() {
        if (EricG.DateTime.Param.DateVariableID > 0) {
            const dateISOStr = EricG.DateTime.getCurrentDate().toISOString().split('T')[0]; // "YYYY-MM-DD"
            $gameVariables.setValue(EricG.DateTime.Param.DateVariableID, dateISOStr);
        }
    }

    function saveWeekDayToVariable() {
        if (EricG.DateTime.Param.WeekDayVariableID > 0) {
            const weekDayIndex = EricG.DateTime.getCurrentDate().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
            $gameVariables.setValue(EricG.DateTime.Param.WeekDayVariableID, weekDayIndex);
        }
    }

    function saveStageToVariable() {
        if (EricG.DateTime.Param.StageVariableID > 0) {
            const stageIndex = EricG.DateTime.getCurrentStage();
            $gameVariables.setValue(EricG.DateTime.Param.StageVariableID, stageIndex);
        }
    }

    EricG.DateTime.getCurrentDate = function() {
        if (!$gameSystem._EGP_DateTime_CurrentDate) {
            EricG.DateTime.setDate(EricG.DateTime.Param.StartDateStr);
        }

        const currentDate = $gameSystem._EGP_DateTime_CurrentDate;
        // Convert $gameSystem._EGP_DateTime_CurrentDate to Date object if necessary
        if (!(currentDate instanceof Date)) {
            $gameSystem._EGP_DateTime_CurrentDate = new Date(currentDate);
        } 
        return $gameSystem._EGP_DateTime_CurrentDate;
    }

    EricG.DateTime.getCurrentStage = function() {
        if (!$gameSystem._EGP_DateTime_CurrentStage) {
            EricG.DateTime.setStage(0);
        }
        return $gameSystem._EGP_DateTime_CurrentStage;
    }

    EricG.DateTime.setDate = function(dateStr) {
        const parts = dateStr.split('-'); // "2025-01-01"
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // JS Month is 0-indexed
        const day = parseInt(parts[2]);
        $gameSystem._EGP_DateTime_CurrentDate = new Date(year, month, day);
    }

    EricG.DateTime.setStage = function(stageIndex) {
        $gameSystem._EGP_DateTime_CurrentStage = stageIndex;
    }

    EricG.DateTime.advanceDays = function(days) {
        const currentDate = EricG.DateTime.getCurrentDate();
        $gameSystem._EGP_DateTime_CurrentDate.setDate(currentDate.getDate()+days);
    }

    EricG.DateTime.nextDay = function() {
        EricG.DateTime.advanceDays(1);
    }

    EricG.DateTime.advanceStages = function(steps) {
        const currentStage = EricG.DateTime.getCurrentStage();
        const stageLength = EricG.DateTime.Param.StageList.length;
        $gameSystem._EGP_DateTime_CurrentStage = (currentStage + steps + stageLength) % stageLength;
    }

    EricG.DateTime.nextStage = function() {
        EricG.DateTime.advanceStages(1);
    }

    EricG.DateTime.getDateDisplaySprite = function() {
        if (!this._dateDisplaySprite) {
            this._dateDisplaySprite = new Sprite_DateDisplay();
        }
        return this._dateDisplaySprite;
    }

    EricG.DateTime.getDateStr = function() {
        const date = EricG.DateTime.getCurrentDate();
        return EricG.DateTime.formatDateStr(date, EricG.DateTime.Param.DateFormatStr);
    }

    EricG.DateTime.getStageStr = function() {
        return EricG.DateTime.Param.StageList[EricG.DateTime.getCurrentStage()].trim() || "Unknown Stage";
    }

    function Sprite_DateDisplay() {
        this.initialize.apply(this, arguments);
    }

    Sprite_DateDisplay.prototype = Object.create(Sprite.prototype);
    Sprite_DateDisplay.prototype.constructor = Sprite_DateDisplay;

    Sprite_DateDisplay.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.bitmap = new Bitmap(300, 48);
        this.x = 10;
        this.y = 10;
    }

    Sprite_DateDisplay.prototype.setText = function(text) {
        this.bitmap.clear();
        this.bitmap.fontSize = 20;
        this.bitmap.drawText(text, 0, 0, 300, 48, 'left');
    }

    Sprite_DateDisplay.prototype.refresh = function() {
        const text = `${EricG.DateTime.getDateStr()} ${EricG.DateTime.getStageStr()}`
        this.setText(text)
    }

    Sprite_DateDisplay.prototype.hide = function() {
        this.visible = false
    }      

    EricG.DateTime.formatDateStr = function(date, formatStr) {
        const dateStr = formatStr
            .replace("{YYYY}", date.getFullYear())
            .replace("{MM}", String(date.getMonth() + 1).padStart(2, '0'))
            .replace("{M}", date.getMonth() + 1)
            .replace("{DD}", String(date.getDate()).padStart(2, '0'))
            .replace("{D}", date.getDate());

        if (EricG.DateTime.Param.ShowWeekDay) {
            const weekDayName = EricG.DateTime.Param.WeekDayNames[date.getDay()] || "";
            return `${dateStr} (${weekDayName})`;
        } else {
            return dateStr;
        }
    };

})();
