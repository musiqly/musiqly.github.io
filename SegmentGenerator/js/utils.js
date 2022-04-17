class Utils {
    static durationToText(duration) {
        let mins=Math.trunc(duration/600);
        mins=(mins.toString().length<2)?"0"+mins:mins;
        let secs=Math.trunc((duration%600)/10);
        secs=(secs.toString().length<2)?"0"+secs:secs;
        return mins+":"+secs+"."+Math.trunc((duration%600)%10);
    }

    static textToDuration(text) {
        let parts=text.split(":");
        let mins=parseInt(parts[0].trim());
        let secs=parseInt(parts[1].split(".")[0].trim());
        let decaSec=parseInt(parts[1].split(".")[1].trim());
        return ((mins*600)+(secs*10)+(decaSec));
    }
    
    static mergeDurationParams(mins, secs, dSecs) {
        return ((parseInt(mins)*600)+(parseInt(secs)*10)+(parseInt(dSecs)));
    }

    static splitDurationParams(duration) {
        duration=parseInt(duration);
        let mins=Math.trunc(duration/600);
        let secs=Math.trunc((duration%600)/10);
        let dSecs=Math.trunc((duration%600)%10);
        return [mins, secs, dSecs];
    }

    static filterName(str) {
        let words=str.split(" ");
        let result="";
        for(let word of words) {
            if(word.trim()=="")
            {} else 
                result+=" "+(word.charAt(0).toUpperCase()+word.substring(1).toLowerCase());
        }
        return result.substring(1, result.length);
    }
}