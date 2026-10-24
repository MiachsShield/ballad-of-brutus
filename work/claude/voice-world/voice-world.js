/* Overworld voices (Robert, 2026-10-19: change overworld info to be coming from characters
   themselves: I CAN'T BELIEVE X WAS KICKED OUT OF Y!!).
   Dispatch cards now lead with a character's own line, in sentence case (all caps was dropped,
   2026-10-20: an eyesore in game writing). The speaker is a bystander
   (someone alive who is not in the story), picked from the card id so it never changes between
   renders. The original facts stay under the quote, so no information is lost.
   Display only: nothing here touches state, saves or the dispatch list itself.
   Source text must stay free of double quotes, backticks, backslashes and dollar signs. */
const VW_AP=String.fromCharCode(39), VW_LQ=String.fromCharCode(8220), VW_RQ=String.fromCharCode(8221);
function vwGuildIn(body){
 try{for(const g of Object.values((S&&S.guilds)||{})){if(g&&g.name&&body.includes(g.name))return g.name;}}catch(err){}
 return '';
}
function vwSpeaker(e){
 try{
  const acts=(e.actors||[]);
  const used=new Set(acts.map(a=>a.id));
  const pool=((S&&S.agents)||[]).filter(a=>a&&a.alive!==false&&a.name&&!used.has(a.id));
  if(!pool.length)return null;
  const full=((S&&S.agents)||[]);
  const subj=acts.map(x=>full.find(a=>a&&a.id===x.id)).filter(Boolean);
  const near=pool.filter(p=>subj.some(x=>(x.affiliation&&x.affiliation===p.affiliation)||(x.region&&x.region===p.region)));
  const from=near.length?near:pool;
  return from[(Number(e.id)||0)%from.length];
 }catch(err){return null;}
}
const VW_STAGE={
 Loyal:['{N} catches my sleeve, {p} voice low and unsteady.','{N} sets down what {s} is carrying and meets my eyes.','{N} steps into my path, hands twisting together.','{N} finds me in the crowd and does not let go of my arm.'],
 Cautious:['{N} checks the doorway behind {o} before {s} speaks.','{N} pulls me into the shadow of a wall, {p} eyes darting.','{N} waits until the crowd thins, then whispers.','{N} will not look at me. {N} talks to the floor.'],
 Proud:['{N} plants {o}self in front of me, chin high.','{N} speaks loud enough for the whole street to hear.','{N} stops me with a raised hand, as if it were {p} right.','{N} draws {o}self up and fixes me with a stare.'],
 Ambitious:['{N} falls into step beside me, grinning like a cat.','{N} leans in, {p} eyes bright, {p} words quick.','{N} has been waiting for me. It shows.','{N} takes my elbow and steers me out of the crowd.'],
 Mercenary:['{N} holds out a hand, palm up, then thinks better of it.','{N} does not look up from counting coins.','{N} shrugs, then drops {p} voice anyway.','{N} leans on a post and watches me with half a smile.']
};
const VW_ASIDE={
 Loyal:['They deserved better than this.','I keep thinking about it.','Somebody ought to stand by them.'],
 Cautious:['I am keeping my head down. You should too.','Do not repeat where you heard it.','Nothing good comes of getting involved.'],
 Proud:['I would never have let it come to that.','It reflects on all of us.','Remember who told you first.'],
 Ambitious:['Somebody is going to rise on the back of this.','There is an opening in it, if you are quick.','Mark my words, this changes things.'],
 Mercenary:['Not my business. Unless someone is paying.','It will all come down to coin, it always does.','Stay and I will tell you the rest, for a fee.']
};
function vwPron(a){const g=a&&a.gender;return g==='Female'?{s:'she',o:'her',p:'her'}:g==='Male'?{s:'he',o:'him',p:'his'}:{s:'they',o:'them',p:'their'};}
function vwBeat(sp,tpl){
 const pr=vwPron(sp), first=String(sp.name).split(' ')[0];
 let out=tpl.split('{N}').join(first).split('{p}').join(pr.p).split('{s}').join(pr.s);
 out=out.split('{o}self').join(pr.o==='them'?'themselves':pr.o+'self').split('{o}').join(pr.o);
 return out;
}
function vwPick(list,n){return list[(Math.abs(Number(n)||0))%list.length];}
function vwLine(e){
 const body=String(e.body||''), A=(e.actors&&e.actors[0]&&e.actors[0].name)||'', B=(e.actors&&e.actors[1]&&e.actors[1].name)||'';
 const G=vwGuildIn(body), who=A||'Somebody', cant='I can'+VW_AP+'t believe ';
 if(e.kind==='dungeon')return 'The door is open! Somebody go in before the good stuff is gone.';
 if(e.kind==='revenge')return A?A+' never forgets. I said so at the time.':'Nobody forgets anything around here.';
 if(!A&&/Among people|hasn.t dealt with/i.test(body))return 'The numbers are in and I do not like them. So many people gone, and nobody will say where.';
 const rep=/standing changed from (-?[0-9]+) to (-?[0-9]+)/i.exec(body);
 if(rep&&A)return Number(rep[2])>=Number(rep[1])?who+' is suddenly everybody'+VW_AP+'s favourite. Since when? What did they do?':'Nobody will say '+who+VW_AP+'s name out loud anymore. What did they do?';
 if(/bounty/i.test(body))return A?'A bounty on '+who+'? Who is paying for that? Who is collecting?':'Somebody put a bounty up. Go and look.';
 if(/died|dead|death|killed|does not come back|doesn.t come back|didn.t come back|doesn.t survive/i.test(body))return cant+who+' is gone. Somebody tell me it isn'+VW_AP+'t true.';
 if(/is released|kicked|is broken|is finished|stands down|bench/i.test(body))return cant+who+' was kicked out of '+(G||'the guild')+'! After everything!';
 if(/walks out|packs quietly|leaves|works for them now|poach|out from under/i.test(body))return cant+who+' walked out on '+(G||'them')+'. Just like that.';
 if(/signs on|joins|hire|signed|buys out|bought out/i.test(body))return who+' has a new employer. Did you see the price? I did not see the price.';
 if(/lifts|robbed|coffers|spoils|papers|stolen|steal/i.test(body))return cant+who+' got robbed. In broad daylight. With witnesses.';
 if(/confirmed|are they or|seen together|colleagues|make up/i.test(body))return B?cant+who+' and '+B+'! I knew it. I knew it the whole time.':who+' has been seen with someone. Do not ask me who.';
 if(/spreads word|puts it about|slander|puts a story|dirt|forges|impersonat/i.test(body))return 'Did you hear what is being said about '+(B||who)+'? I heard it from three people.';
 if(/clash|fight|duel|wins the fight/i.test(body))return who+(B?' and '+B:'')+' went at it. I saw it myself. I was right there.';
 if(/auction|hammer|sold/i.test(body))return (G||who)+' is selling off its best. Get there early.';
 if(/sponsor|invited|gift/i.test(body))return who+' got the nice thing. Good for them. I am not bitter.';
 if(/loyalty|upkeep|payroll|desertion/i.test(body))return 'Somebody has not been paid. I am not naming names.';
 if(/reaches lv|retrains/i.test(body))return who+' is a whole different person now. Did you see?';
 return 'You have to hear this. It is about '+who+'. I can'+VW_AP+'t even say it.';
}
const vwDispatchCardBase=dispatchCard;
dispatchCard=function(e){
 let sp=null, line='';
 try{if(e&&!e.voiced){sp=vwSpeaker(e);line=vwLine(e);}}catch(err){sp=null;}
 if(!sp||!line)return vwDispatchCardBase.apply(this,arguments);
 const pers=VW_STAGE[sp.personality]?sp.personality:'Mercenary';
 const seed=(Number(e.id)||0)+(Number(sp.id)||0);
 const aside=vwPick(VW_ASIDE[pers],seed);
 const beat=vwBeat(sp,vwPick(VW_STAGE[pers],seed+1));
 const facts=(e.body||'')+(e.effect?' '+e.effect:'');
 const clone=Object.assign({},e,{
  title:beat,
  body:VW_LQ+line+VW_RQ+' '+VW_LQ+aside+VW_RQ,
  effect:facts,
  voiced:true});
 return vwDispatchCardBase.call(this,clone);
};
