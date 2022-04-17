let rangeSelectors=null;
let rangeSelectorMinDiff=10;

window.addEventListener("load", ()=>{
    rangeSelectors=document.getElementsByClassName("range-selector");

    makeSelectors();
});

function makeSelectors() {
    for(let rangeSelector of rangeSelectors) {
        let range1=document.createElement("input");
        range1.setAttribute("type", "range");
        range1.setAttribute("class", "startKnob");
        range1.setAttribute("value", 0);
        let range2=document.createElement("input");
        range2.setAttribute("type", "range");
        range2.setAttribute("class", "endKnob");
        range2.setAttribute("value", 100);
        rangeSelector.appendChild(range1);
        rangeSelector.appendChild(range2);

        rangeSelector.setMax=function(maxVal) {
            this.max=maxVal;
            range1.max=maxVal;
            range2.max=maxVal;
            this.fillColor();
        }

        rangeSelector.setStartValue=function(startVal) {
            range1.value=startVal;
            adjustKnobs(range1);
        }

        rangeSelector.setEndValue=function(endVal) {
            range2.value=endVal;
            adjustKnobs(range2);
        }

        rangeSelector.getStartValue=function() {
            return parseInt(range1.value);
        }

        rangeSelector.getEndValue=function() {
            return parseInt(range2.value);
        }

        rangeSelector.setRange=function(start, end) {
            range2.value=start+rangeSelectorMinDiff;
            range1.value=end;
            adjustKnobs(range1);
            range2.value=end;
            adjustKnobs(range2);
        }

        rangeSelector.setFocusable=function(isFocusable) {
            let inputs=this.getElementsByTagName("input");
            for(let input of inputs) {
                input.onfocus=function() {
                    if(!isFocusable)
                        this.blur();
                };
            }
        }

        rangeSelector.setMinValue=function(minVal) {
            minVal=parseInt(minVal);
            range2.value=minVal+(range2.value-range1.value);
            adjustKnobs(range2);
            range1.value=minVal;
            rangeSelector.minValue=minVal;
            adjustKnobs(range1);
        }

        rangeSelector.getMinValue=function() {
            return this.minValue;
        }

        rangeSelector.fixStart=function(fixValue) {
            rangeSelector.startFixValue=fixValue;
            if(range2.value<(fixValue+rangeSelectorMinDiff))
                range2.value=fixValue+(range2.value-range1.value);
            adjustKnobs(range1);
        }

        rangeSelector.getStartFix=function() {
            return this.startFixValue;
        }

        rangeSelector.fixEnd=function(fixValue) {
            rangeSelector.endFixValue=fixValue;
            if(range1.value>(fixValue-rangeSelectorMinDiff))
                range1.value=fixValue-(range2.value-range1.value);
            adjustKnobs(range2);
        }

        rangeSelector.getEndFix=function() {
            return this.endFixValue;
        }

        rangeSelector.clearFix=function() {
            rangeSelector.startFixValue=null;
            rangeSelector.endFixValue=null;
        }

        rangeSelector.fillColor=function() {
            let range1=this.getElementsByClassName("startKnob")[0];
            let range2=this.getElementsByClassName("endKnob")[0];

            percent1 = (parseInt(range1.value) / parseInt(range1.max)) * 100;
            percent2 = (parseInt(range2.value) / parseInt(range2.max)) * 100;
            rangeSelector.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
        }

        rangeSelector.setMax(600);

        range1.addEventListener("input", e=>{adjustKnobs(e)});
        range2.addEventListener("input", e=>{adjustKnobs(e)});

        rangeSelector.addEventListener("mousemove", e=>showToolTip(e));

        adjustKnobs(range1);
    }
}

function adjustKnobs(event) {
    let toChange=null;
    if(event.target==null)
        toChange=event;
    else 
        toChange=event.target;
    let src=toChange.parentElement;
    let startKnob=src.getElementsByClassName("startKnob")[0];
    let endKnob=src.getElementsByClassName("endKnob")[0];
    let startKnobVal=parseInt(startKnob.value);
    let endKnobVal=parseInt(endKnob.value);

    if(toChange==startKnob) {
        if(src.startFixValue!=null)
            startKnob.value=src.startFixValue;
        else if(startKnobVal<src.minValue)
            startKnob.value=src.minValue;
        else if(startKnobVal>(endKnobVal-rangeSelectorMinDiff))
            startKnob.value=endKnobVal-rangeSelectorMinDiff;
    } else if(toChange==endKnob) {
        if(src.endFixValue!=null)
            endKnob.value=src.endFixValue;
        else if(endKnobVal>src.maxValue)
            endKnob.value=src.maxValue;
        else if(endKnobVal<(startKnobVal+rangeSelectorMinDiff))
            endKnob.value=startKnobVal+rangeSelectorMinDiff;
    }
    if(src.onValueUpdate!=null)
        src.onValueUpdate(startKnob.value, endKnob.value);
    
    src.fillColor();
}

function showToolTip(e) {
    let src=e.target;

    let hoverValue=(e.offsetX / e.target.clientWidth) *  parseInt(e.target.max,10);
    let mins=Math.trunc(hoverValue/600);
    mins=(mins.toString().length<2)?"0"+mins:mins;
    let secs=Math.trunc((hoverValue%600)/10);
    secs=(secs.toString().length<2)?"0"+secs:secs;
    src.title=mins+":"+secs+"."+Math.trunc((hoverValue%600)%10);
}