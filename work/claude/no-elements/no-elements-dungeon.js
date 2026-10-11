// No elements, dungeon side: the proc log line says what happened without naming an element.
const neBaseLog=logMsg;
logMsg=function(m,cls){
 if(typeof m==='string')m=m.replace(/ triggers — (?:fire|lightning|frost|poison|holy|shadow) damage for /i,' triggers for ');
 return neBaseLog(m,cls);
};
