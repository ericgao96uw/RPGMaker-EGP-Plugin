//=============================================================================
// EGP_DateTimeSystem.js
//=============================================================================

var Imported = Imported || {};
Imported.EGP_DateTimeSystem = true;

var EricG = EricG || {};
EricG.DateTime = EricG.DateTime || {};
EricG.DateTime.version = 1.0;


/*:
 * @plugindesc EGP_DateTimeSystem - Tracks in-game date and time stages, and shows a display window. 
 * @author EricG
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
 * @help
 * 
 * ===================================================================
 * Plugin Command
 * ===================================================================
 *  EGP_DateTime show                # Show the date and stage sprite in the upper-left corner.
 *  EGP_DateTime hide                # Hide the date and stage sprite.
 *  EGP_DateTime setDate 2025-05-01  # Set current date to specific date (in YYYY-MM-DD format).
 *  EGP_DateTime setStage 1          # Set current stage to specific index (0-based). 
 *  EGP_DateTime advanceDays 5       # Advance the date to the next X days. 
 *  EGP_DateTime advanceStages 2     # Advance the stage to the next X stages.
 *  EGP_DateTime nextDay             # Advance the date to the next day.
 *  EGP_DateTime nextStage           # Advance the stage to the next one (e.g. from Morning to Noon).
 */

(function() {
    const parameters = PluginManager.parameters("EGP_DateTimeSystem");
    EricG.DateTime.Param = EricG.DateTime.Param || {};

    EricG.DateTime.Param.StartDateStr = parameters["StartDate"] || "2025-01-01";
    EricG.DateTime.Param.StageList = (parameters["Stages"] || "Morning,Noon,Afternoon").split(',');
    EricG.DateTime.Param.DateFormatStr = parameters["DateFormatStr"] || "{YYYY}-{MM}-{DD}";

    
    // Plugin Commands
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'EGP_DateTime') {
            switch (args[0]) {
            case 'show':
                SceneManager._scene.addChild(EricG.DateTime.getDateDisplaySprite());
                EricG.DateTime.getDateDisplaySprite().refresh();
                break;
            case 'hide':
                SceneManager._scene.removeChild(EricG.DateTime.getDateDisplaySprite())
                break;
            case 'setDate':
                const dateStr = String(args[1]);
                EricG.DateTime.setDate(dateStr);
                EricG.DateTime.getDateDisplaySprite().refresh();
                break;
            case 'setStage':
                EricG.DateTime.setStage(parseInt(args[1]));
                EricG.DateTime.getDateDisplaySprite().refresh();
                break;
            case 'advanceDays':
                EricG.DateTime.advanceDays(parseInt(args[1]));
                EricG.DateTime.getDateDisplaySprite().refresh();
                break;
            case 'advanceStages':
                EricG.DateTime.advanceStages(parseInt(args[1]));
                EricG.DateTime.getDateDisplaySprite().refresh();
                break;
            case 'nextDay':
                EricG.DateTime.nextDay();
                EricG.DateTime.getDateDisplaySprite().refresh();
                break;
            case 'nextStage':
                EricG.DateTime.nextStage();
                EricG.DateTime.getDateDisplaySprite().refresh();
                break;
            }
        }
    };  

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
        const date = new Date(year, month, day);
        $gameSystem._EGP_DateTime_CurrentDate = date;
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
        const newStage = (currentStage + steps + stageLength) % stageLength;
        $gameSystem._EGP_DateTime_CurrentStage = newStage;
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
        return formatStr
            .replace("{YYYY}", date.getFullYear())
            .replace("{MM}", String(date.getMonth() + 1).padStart(2, '0'))
            .replace("{M}", date.getMonth() + 1)
            .replace("{DD}", String(date.getDate()).padStart(2, '0'))
            .replace("{D}", date.getDate());
    };

})();
