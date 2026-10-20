/* Overworld voices (Robert, 2026-10-19: change overworld info to be coming from characters
   themselves: I CAN'T BELIEVE X WAS KICKED OUT OF Y!!).
   Dispatch cards now lead with a character's own shouted line. The speaker is a bystander
   (someone alive who is not in the story), picked from the card id so it never changes between
   renders. The original facts stay under the quote, so no information is lost.
   Display only: nothing here touches state, saves or the dispatch list itself.
   Source text must stay free of double quotes, backticks, backslashes and dollar signs. */
const VW_AP=String.fromCharCode(39), VW_LQ=String.fromCharCode(8220), VW_RQ=String.fromCharCode(8221);
function vwUp(s){return String(s).toUpperCase();}
function vwGuildIn(body){
 try{for(const g of Object.values((S&&S.guilds)||{})){if(g&&g.name&&body.includes(g.name))return g.name;}}catch(err){}
 return '';
}
function vwSpeaker(e){
 try{
  const used=new Set((e.actors||[]).map(a=>a.id));
  const pool=((S&&S.agents)||[]).filter(a=>a&&a.alive!==false&&a.name&&!used.has(a.id));
  if(!pool.length)return null;
  return pool[(Number(e.id)||0)%pool.length];
 }catch(err){return null;}
}
function vwLine(e){
 const body=String(e.body||''), A=(e.actors&&e.actors[0]&&e.actors[0].name)||'', B=(e.actors&&e.actors[1]&&e.actors[1].name)||'';
 const G=vwGuildIn(body), a=vwUp(A), b=vwUp(B), g=vwUp(G);
 const who=a||'SOMEBODY', cant='I CAN'+VW_AP+'T BELIEVE ';
 if(e.kind==='dungeon')return 'THE DOOR IS OPEN!! SOMEBODY GO IN BEFORE THE GOOD STUFF IS GONE!!';
 if(e.kind==='revenge')return a?who+' NEVER FORGETS!! I SAID SO!! I SAID SO AT THE TIME!!':'NOBODY FORGETS ANYTHING AROUND HERE!!';
 if(!A&&/Among people|hasn.t dealt with/i.test(body))return 'THE NUMBERS ARE IN AND I DO NOT LIKE THEM!! SO MANY PEOPLE GONE, AND NOBODY WILL SAY WHERE!!';
 const rep=/standing changed from (-?[0-9]+) to (-?[0-9]+)/i.exec(body);
 if(rep&&A)return Number(rep[2])>=Number(rep[1])?who+' IS SUDDENLY EVERYBODY'+VW_AP+'S FAVOURITE!! SINCE WHEN?! WHAT DID THEY DO?!':'NOBODY WILL SAY '+who+VW_AP+'S NAME OUT LOUD ANYMORE!! WHAT DID THEY DO?!';
 if(/bounty/i.test(body))return a?'A BOUNTY ON '+who+'?! WHO IS PAYING FOR THAT?! WHO IS COLLECTING?!':'SOMEBODY PUT A BOUNTY UP!! GO LOOK!!';
 if(/died|dead|death|killed|does not come back|doesn.t come back|didn.t come back|doesn.t survive/i.test(body))return cant+who+' IS GONE!! SOMEBODY TELL ME IT ISN'+VW_AP+'T TRUE!!';
 if(/is released|kicked|is broken|is finished|stands down|bench/i.test(body))return cant+who+' WAS KICKED OUT OF '+(g||'THE GUILD')+'!! AFTER EVERYTHING!!';
 if(/walks out|packs quietly|leaves|works for them now|poach|out from under/i.test(body))return cant+who+' WALKED OUT ON '+(g||'THEM')+'!! JUST LIKE THAT!!';
 if(/signs on|joins|hire|signed|buys out|bought out/i.test(body))return who+' HAS A NEW EMPLOYER!! DID YOU SEE THE PRICE?! I DID NOT SEE THE PRICE!!';
 if(/lifts|robbed|coffers|spoils|papers|stolen|steal/i.test(body))return cant+who+' GOT ROBBED!! IN BROAD DAYLIGHT!! WITH WITNESSES!!';
 if(/confirmed|are they or|seen together|colleagues|make up/i.test(body))return b?cant+who+' AND '+b+'!! I KNEW IT!! I KNEW IT THE WHOLE TIME!!':who+' HAS BEEN SEEN WITH SOMEONE!! DO NOT ASK ME WHO!!';
 if(/spreads word|puts it about|slander|puts a story|dirt|forges|impersonat/i.test(body))return 'DID YOU HEAR WHAT IS BEING SAID ABOUT '+(b||who)+'?! I HEARD IT FROM THREE PEOPLE!!';
 if(/clash|fight|duel|wins the fight/i.test(body))return who+(b?' AND '+b:'')+' WENT AT IT!! I SAW IT MYSELF!! I WAS RIGHT THERE!!';
 if(/auction|hammer|sold/i.test(body))return (g||who)+' IS SELLING OFF ITS BEST!! GET THERE EARLY!!';
 if(/sponsor|invited|gift/i.test(body))return who+' GOT THE NICE THING!! GOOD FOR THEM!! I AM NOT BITTER!!';
 if(/loyalty|upkeep|payroll|desertion/i.test(body))return 'NOBODY HAS BEEN PAID!! I AM NOT NAMING NAMES!! BUT SOMEBODY HAS NOT BEEN PAID!!';
 if(/reaches lv|retrains/i.test(body))return who+' IS A WHOLE DIFFERENT PERSON NOW!! DID YOU SEE?!';
 return 'YOU HAVE TO HEAR THIS!! IT IS ABOUT '+who+'!! I CAN'+VW_AP+'T EVEN SAY IT!!';
}
const vwDispatchCardBase=dispatchCard;
dispatchCard=function(e){
 let sp=null, line='';
 try{if(e&&!e.voiced){sp=vwSpeaker(e);line=vwLine(e);}}catch(err){sp=null;}
 if(!sp||!line)return vwDispatchCardBase.apply(this,arguments);
 const clone=Object.assign({},e,{
  title:VW_LQ+line+VW_RQ,
  body:sp.name+(sp.epithet?', '+sp.epithet:'')+'. The facts: '+(e.body||''),
  voiced:true});
 return vwDispatchCardBase.call(this,clone);
};
