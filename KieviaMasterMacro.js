//RationsMacro, no variation version----------------------

// Number of items to be consumed by this PC
let x = 10

// Target Actors (not dynamic)
let actorList = ["stores"] 

//Create empty array for actor objects.
const actorNames = [] 

//Specify the item, could be substituted for any item name
let item = "Rations"; 

//Creates an empty list object for printing final output
let list = "" 
let RemainingRationsList = ""
let RemainingDaysList = ""

// Convert actor names in actorList to Actor Objects and add them to actorNames list
for (let actorString of actorList){ 
    let actor = game.actors.getName(actorString);
    actorNames.push(actor);
}

// Iterate through actorNames list and do stuff with items
for(let target of actorNames){
    // Looks for item in each target's inventory
    let getItem = await target.items.find(i=> i.name === item);

   //This is how many rations an actor has left.
   let RemainingRations = getItem.data.data.quantity
   let RemainingRationsString = (RemainingRations.toString()-x)
   RemainingRationsList += RemainingRationsString

   //This is how many days the remaining rations will last them
   let RemainingDaysStringA = RemainingRations.toString()-x
   let RemainingDaysStringB = Math.floor(RemainingDaysStringA/x)
   RemainingDaysList += RemainingDaysStringB;

    // If it was not found OR the quantity is somehow less than zero, complain.
    if((!getItem) || (getItem.data.data.quantity < 0)){
        list += `<li>The ${target.name} are empty</li>`;
    }

    // If it's found AND quantity is greater than 0, update the quantity by X and notify.
    if((await target.items.find(i=> i.name === item)) && (getItem.data.data.quantity > 0)){
        await getItem.update({"data.quantity" : getItem.data.data.quantity -[x.toString()]});
        list += `<li>You ate ${x.toString()} ${getItem.name} from the ${target.name}</li>`;
    }

    // If it's found AND quantity is less than .5, delete item & complain.
    if((await target.items.find(i=> i.name === item)) && (getItem.data.data.quantity < .5)){
        await getItem.delete();
        list += `<li>You ate the last ${getItem.name} from the ${target.name}</li>`;
    }
}

//Advances time by a day.-----------------------------------------------------------------------------------------------------
SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Sunrise);

//This Diff Calc is giving us "Day 1", then the MathAdjusted adds 273 days to indicate the number of days between Jan 1 and Oct 1 aka Math Adjusted.
//Date difference calculator
const CurrentDate = SimpleCalendar.api.timestamp()
const StartDate = 52029302400
//The number in StartDate is the format for the calendar API for the start date of October 1st.
//The number added to end of Math1 is 86400*2. Adding 86400 to the longer number adds a day.
const Math1 = CurrentDate - StartDate  + 172800
const Math2 = `${Math1 / 86400}`
const Math3 = `<H1>DAY ${Math1 / 86400}</H1>`
const MathAdjusted = Number(Math2) + 273
console.log("MathAdjusted1")
console.log(MathAdjusted)

//DAYLIGHT------------------------------------------------------------------------------
//Raw number hours, (decimal is minutes in hour units)
let Daylight = 13*Math.sin((2*Math.PI/365)*(MathAdjusted-81.75))+12

//Var x is the multiple you are rounding temperature to
var Round = 1;

//Where negative values are ok
let DaylightHourInteger = Math.floor(Daylight);

//Where the min possible value = 0, so no negatives
let DaylightHour = Math.round(Math.max(Daylight,0));

let DaylightMinute = ('round', Math.round(((Daylight-DaylightHourInteger)*60)/Round) * Round);

//Modifies the Temp Table based on # days passed.-----------------------------------------------------------------------------
//Randomly selects positive or negative
let PosNeg = Math.round(Math.random()) * 2 - 1

//Does math based on day and function to output random temperature
let WeatherForDay = 40*Math.sin((2*Math.PI/365)*(MathAdjusted-81.75))
console.log("WeatherForDay (Before mods)")
console.log(WeatherForDay)

//Now we need to modify it slightly
//Randomized modifer and pos/neg modifier
let RandBetween = PosNeg*(Math.floor(Math.random() * 10)+1)
console.log("Mod")
console.log(RandBetween)

//Now lets put them together
let FinalRandom = WeatherForDay+RandBetween

//Var x is the multiple you are rounding temperature to
var Round = 10;

let TempOutput = ('round', Math.round(FinalRandom/Round) * Round);

console.log("TempOutput")
console.log(TempOutput)
console.log("________________________________")

const Winddirection = game.tables.getName("Wind Direction Table");
const WindDirectionResult = (await Winddirection.roll()).results[0].getChatText();;

const Windspeed = game.tables.getName("Windspeed Table");
const WindspeedText = (await Windspeed.roll()).results[0].getChatText();;
let WindspeedResult = parseInt(WindspeedText, 10)

const Precipitation = game.tables.getName("Precipitation Table");
const PrecipitationResult = (await Precipitation.roll()).results[0].getChatText();;

// Checks current time and then declares Date as a string of that result
const gameTime = SimpleCalendar.api.timestampToDate(SimpleCalendar.api.timestamp());
const Date = `${gameTime.display.weekday}, ${gameTime.display.monthName} ${gameTime.display.day}${gameTime.display.daySuffix}`


//Windchill---------------------------------------------------------------------------------------------------------------------------
//Arrays go in chunks starting at 0, and within chunks starting at 0
//Uses the Temp and Windspeed outputs from above
//We do algebra to convert Temp to the (0-9) and Wind to (1-4)
//We then take declare result a variable and slap that variable into "const Intersect = TheTable[nestA][nestB]", which checks table and declares output as "Intersect"

let nestA = ((TempOutput.toString()-50)/-10)
let nestB = ((WindspeedResult.toString()/10))

console.log('nestA')
console.log(nestA)
console.log('nestB')
console.log(nestB)
      
            
let TheTable = [['50','46','44','42','40'],['40','33','30','28','26'],['30','20','18','14','12'],['20','8','4','1','-2'],['10','-4','-9','-13','-15'],['0','-15','-21','-25','-30'],['-10','-28','-35','-39','-42'],['-20','-40','-48','-53','-57'],['-30','-53','-61','-66','-70'],['-40','-65','-75','-80','-84'],['-50','-78','-88','-94','-98'],['-60','-90','-100','-107','-112'],['-70','-102','-113','-120','-126']];

const WindChillIntersect = TheTable[nestA][nestB]

console.log('WindChillIntersect')
console.log(WindChillIntersect)
//const WindChillOutput = WindChillIntersect

//-----------------------------------------------------------------------------------------------------------------------------------------------------
//This is the Healing Parts and Daily Sanity Reset Stuff. It won't show shit for actors with full HP, but always reset Daily San (no message needed)

//Declares list of actors for the array
let actorListHeal = ["Erastus Stolyarchuk","Mason","Oksana Karpenko","Rua"]
const actorNamesHeal = actorListHeal.map(i => game.actors.getName(i));
let HealthStuffChat = `<p></p>`

for(let actor of actorNamesHeal){
const COC7 = {}
COC7.status = {unconscious: 'unconscious',criticalWounds: 'criticalWounds',}
let healAmount = 1
const isCriticalWounds = actor.hasConditionStatus(COC7.status.criticalWounds)
const hpValue = actor.data.data.attribs.hp.value
const hpMax = actor.data.data.attribs.hp.max
const dailySanityLoss = actor.data.data.attribs.san.dailyLoss
const oneFifthSanity =
' / ' + Math.floor(actor.data.data.attribs.san.value / 5)

//Healing Stuff (1st "if" statement nested in the above "for these actors loop")
//you can replace "@JournalEntry[9d8LRwyENYCALP7l]{Major Wounds}" with "Major Wounds" if you get an error. Tried to make it a link.

	if (hpValue < hpMax) {
		if (isCriticalWounds === true) {
			HealthStuffChat =
			HealthStuffChat +
				`<li style="color:darkred"><b>${actor.name}</b> is unable to Recover Hit Points due to @JournalEntry[9d8LRwyENYCALP7l]{Major Wounds}.</h4>`
			} 
		else {
			healAmount = Math.min(healAmount, hpMax - hpValue)
			if (healAmount === 1) {
				HealthStuffChat =
				HealthStuffChat +
				`<li style="color:darkolivegreen"><b>${actor.name}</b> recovered one Hit Point.</h4>`
				actor.update({'data.attribs.hp.value': actor.data.data.attribs.hp.value + healAmount})
					}
				}
		}
	else {
	HealthStuffChat =
	HealthStuffChat +
	`<li style="color:darkolivegreen"><b>${actor.name}</b> is healthy.</li>`
		}		
	
//Sanity stuff (2nd "if" statement nested in the above "for these actors loop")
	if (dailySanityLoss > 0) {
			actor.update({
			'data.attribs.san.dailyLoss': 0,
			'data.attribs.san.oneFifthSanity': oneFifthSanity
			})
}}
        
//let SanityResetMessage= `Daily Sanity Loss Reset`
//const HealthChatOutput = {
//user: game.user.id,
//speaker: ChatMessage.getSpeaker({alias: SanityResetMessage}),
//content: HealthStuffChat ,
//type: CONST.CHAT_MESSAGE_TYPES.OTHER}
//ChatMessage.create(HealthChatOutput)


//Tie it all Together--------------------------------------------------------------------------------------------------------



// Puts Strings and static text together with some formatting.
let messageTable = Math3 + "<p>" + "<b>Wind: </b>" + WindspeedResult + ' mph'+" " + WindDirectionResult + "<p>" + "<b>Temperature: </b>" + TempOutput + '° F ' + '(' + WindChillIntersect + '° F)' + "<p>" + "<b>Weather: </b>" + PrecipitationResult + "<p>" + "<b>Daylight: </b>" + DaylightHour + " hours, " + DaylightMinute +" minutes"
+ `<h4>${list}</h4>` + `<h4>${RemainingRationsList} Rations left...  ${RemainingDaysList} days for ${x} people </h4>` +`<ul>${HealthStuffChat}</ul>`

//Set up a chat format
let chatData = {
    user: game.user._id,
    type: 1,
    speaker: ChatMessage.getSpeaker({alias: Date}),
    content: messageTable,
};

//Executes chat with content from above
ChatMessage.create(chatData, {});