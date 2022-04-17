let audioPlayer=new Audio();

//Controls
let seekbar=null;
let segmentSelector=null;
let currentTimeDisplays=null;
let maxTimeDisplays=null;
let titleDisplays=null;
let lyricsDisplay=null;
let playButtons=null;
let playSelectedButtons=null;
let backwardButtons=null, forwardButtons=null;
let speedIncrementButtons=null, speedDecrementButtons=null;

//Global Controls
let playbackSpeedDisplay=null;
let jumpPointertoStartBtn=null, jumpPointertoEndBtn=null;
let pointerPositionDisplayElements=null;
let addArtistField=null, addArtistButton=null;
let audioInp=null, lyricsInp=null;

//Segment Controls
let jumpSegmentStartInp=null;
let jumpSegmentEndInp=null;
let segmentStartInpElements=null, segmentEndInpElements=null;
let segmentArtistsDisplay=null;
let segmentArtistField=null, addSegmentArtistBtn=null, addSegmentArtistAndMarkBtn=null;
let addSegmentButton=null;

//Reference Display Variables
let segmentResultDisplay=null;
let downloadSegmentationButton=null;
let downloadSegmentationLink=null;

//Script Variables
let isAudioSelected=false;
let isLyricsSelected=false;
let segmentArtists=[];
let toastInterval=null, isToastDisplayed=false;
let selectedEntry=null;
let workingData=null;
let toPlaySelected=false;

window.addEventListener("load", ()=>{

    //Controls
    seekbar=document.getElementById("seekbar");
    segmentSelector=document.getElementById("segment-selector");
    currentTimeDisplays=document.getElementsByClassName("current-time");
    maxTimeDisplays=document.getElementsByClassName("max-time");
    titleDisplays=document.getElementsByClassName("audio-title");
    lyricsDisplay=document.getElementById("lyricsDisplay");
    playButtons=document.getElementsByClassName("play-btn");
    playSelectedButtons=document.getElementsByClassName("playSelected-btn");
    backwardButtons=document.getElementsByClassName("backward-btn");
    forwardButtons=document.getElementsByClassName("forward-btn");
    speedIncrementButtons=document.getElementsByClassName("speedIncrement-btn");
    speedDecrementButtons=document.getElementsByClassName("speedDecrement-btn");

    //Global Controls
    playbackSpeedDisplay=document.getElementById("playbackSpeedDisplay").getElementsByTagName("span")[1];
    jumpPointertoStartBtn=document.getElementById("jumpPointertoStartBtn");
    jumpPointertoEndBtn=document.getElementById("jumpPointertoEndBtn");
    pointerPositionDisplayElements=document.getElementById("pointerPositionDisplay").getElementsByTagName("input");
    addArtistField=document.getElementById("addArtistField");
    addArtistButton=document.getElementById("addArtistButton");
    audioInp=document.getElementById("audioInp");
    lyricsInp=document.getElementById("lyricsInp");

    //Segment Controls
    jumpSegmentStartInp=document.getElementById("jumpSegmentStartInp");
    jumpSegmentEndInp=document.getElementById("jumpSegmentEndInp");
    segmentStartInpElements=document.getElementById("segmentStartInp").getElementsByTagName("input");
    segmentEndInpElements=document.getElementById("segmentEndInp").getElementsByTagName("input");
    segmentArtistsDisplay=document.getElementById("segmentArtistsDisplay");
    segmentArtistField=document.getElementById("segmentArtistField");
    addSegmentArtistBtn=document.getElementById("addSegmentArtistBtn");
    addSegmentArtistAndMarkBtn=document.getElementById("addSegmentArtistAndMarkBtn");
    addSegmentButton=document.getElementById("addSegmentButton");

    //Reference Display Variables
    segmentResultDisplay=document.getElementById("segmentResultDisplay");
    downloadSegmentationButton=document.getElementById("downloadSegmentationButton");
    downloadSegmentationLink=document.getElementById("downloadSegmentationLink");


    //Add shortcut keys
    document.addEventListener("keydown", e=>{
        switch(e.key.toUpperCase()) {
            case " ":
                if(document.activeElement.nodeName==="INPUT") {
                    if(document.activeElement.type.toUpperCase()!=="TEXT") {
                        if(e.ctrlKey)
                            playSelectedButtons[0].click();
                        else
                            audioPlayer.changeState();
                    }
                } else {
                    e.preventDefault();
                    if(e.ctrlKey)
                        playSelectedButtons[0].click();
                    else
                        audioPlayer.changeState();
                }
                break;
            case "ARROWLEFT":
                if(!e.ctrlKey && !e.altKey && document.activeElement.nodeName!=="INPUT") {
                    backwardButtons[0].click();
                }                
                break;
            case "ARROWRIGHT":
                if(!e.ctrlKey && !e.altKey && document.activeElement.nodeName!=="INPUT") {
                    forwardButtons[0].click();
                }                
                break;
            case "ARROWUP":
                if(document.activeElement.nodeName!=="INPUT") {
                    if(e.ctrlKey) {
                        segmentSelector.setEndValue(segmentSelector.getEndValue()+10);
                    } else if(e.altKey) {
                        segmentSelector.setStartValue(segmentSelector.getStartValue()+10)
                    } else {
                        e.preventDefault();
                        audioPlayer.currentTime+=1;
                    }
                }
                break;
            case "ARROWDOWN":
                if(document.activeElement.nodeName!=="INPUT") {
                    if(e.ctrlKey) {
                        segmentSelector.setEndValue(segmentSelector.getEndValue()-10);
                    } else if(e.altKey) {
                        segmentSelector.setStartValue(segmentSelector.getStartValue()-10)
                    } else {
                        e.preventDefault();
                        audioPlayer.currentTime-=1;
                    }
                }
                break;
            case "M":
                if(e.ctrlKey) {
                    e.preventDefault();
                    jumpSegmentEndInp.click();
                } else if(e.altKey) {
                    e.preventDefault();
                    jumpSegmentStartInp.click();
                }
            break;
            case "P":
                if(e.ctrlKey) {
                    e.preventDefault();
                    jumpPointertoEndBtn.click();
                } else if(e.altKey) {
                    e.preventDefault();
                    jumpPointertoStartBtn.click();
                }
                break;
            case "+":
                //Intentionally created fallthrough
            case "=":
                if(e.ctrlKey) {
                    e.preventDefault();
                    speedIncrementButtons[0].click();
                }
                break;
            case "-":
                if(e.ctrlKey) {
                    e.preventDefault();
                    speedDecrementButtons[0].click();
                }
                break;
            case "0":
                if(e.ctrlKey) {
                    audioPlayer.playbackRate=1;
                    playbackSpeedDisplay.innerText="x"+audioPlayer.playbackRate;
                }
        }
    });

    //Initialize Dialog
    document.getElementById("dialog").getElementsByTagName("button")[0].addEventListener("click", (e)=>{
        e.target.parentElement.style.display="none";
    });



    audioPlayer.familiarPlay=function() {
        if(audioPlayer.src===null || audioPlayer.src.length===0)
            return;
        audioPlayer.play();
        for(let playBtn of playButtons)
            playBtn.style.backgroundImage="url(\"assets/pause.svg\")";
    }
    audioPlayer.familiarPause=function() {
        if(audioPlayer.src===null || audioPlayer.src.length===0)
            return;
        audioPlayer.pause();
        for(let playBtn of playButtons)
            playBtn.style.backgroundImage="url(\"assets/play.svg\")";
    }
    audioPlayer.changeState=function() {
        if(audioPlayer.paused)
            audioPlayer.familiarPlay();
        else
            audioPlayer.familiarPause();
    }

    document.getElementById("loadAudioBtn").addEventListener("click", ()=>{
        document.getElementById("audioInp").click();
    });
    document.getElementById("loadLyricsBtn").addEventListener("click", ()=>{
        document.getElementById("lyricsInp").click();
    });

    initializeControls();
    initialzeSegmentControls();
    initializeGlobalControls();
    initialzeReferenceControls();
});

function initializeControls() {
    audioPlayer.addEventListener("loadedmetadata", ()=>{
        let maxTime=Math.round(audioPlayer.duration*10);
        segmentSelector.setMax(maxTime);
        segmentSelector.fixStart(0);
        seekbar.max=maxTime;
        seekbar.value=0;
        for(let maxTimeDisplay of maxTimeDisplays)
            maxTimeDisplay.textContent=Utils.durationToText(maxTime);
    });

    audioPlayer.addEventListener("timeupdate", (event)=>{
        let currentTime=Math.round(audioPlayer.currentTime*10);

        if(toPlaySelected && currentTime>=segmentSelector.getEndValue()) {
            audioPlayer.familiarPause();
            toPlaySelected=false;
        }

        seekbar.value=currentTime;
        for(let currentTimeDisplay of currentTimeDisplays)
            currentTimeDisplay.textContent=Utils.durationToText(currentTime);
        let durationParams=Utils.splitDurationParams(currentTime);
        for(let i=0;i<durationParams.length;i++)
            pointerPositionDisplayElements[i].value=durationParams[i];
    });

    for(let playBtn of playButtons) {
        playBtn.addEventListener("click", (event)=>{
            audioPlayer.changeState();
        });
    }

    for(let playSelectedButton of playSelectedButtons) {
        playSelectedButton.addEventListener("click", ()=>{
            toPlaySelected=true;
            audioPlayer.currentTime=segmentSelector.getStartValue()/10;
            audioPlayer.familiarPlay();
        });
    }

    for(let backwardButton of backwardButtons) {
        backwardButton.addEventListener("click", ()=>{
            audioPlayer.currentTime-=10;
        });
    }

    for(let forwardButton of forwardButtons) {
        forwardButton.addEventListener("click", ()=>{
            audioPlayer.currentTime+=10;
        });
    }

    for(let speedIncrementButton of speedIncrementButtons) {
        speedIncrementButton.addEventListener("click", ()=>{
            if(audioPlayer.playbackRate+0.25>2) {
                showToast("Maximum Speed");
            } else {
                audioPlayer.playbackRate+=0.25;
                playbackSpeedDisplay.innerText="x"+audioPlayer.playbackRate;
            }
        });
    }

    for(let speedDecrementButton of speedDecrementButtons) {
        speedDecrementButton.addEventListener("click", ()=>{
            if(audioPlayer.playbackRate-0.25<0.25) {
                showToast("Minimum speed");
            } else {
                audioPlayer.playbackRate-=0.25
                playbackSpeedDisplay.innerText="x"+audioPlayer.playbackRate;
            }
        });
    }

    seekbar.addEventListener("input", ()=>{
        audioPlayer.currentTime=seekbar.value/10;
    });

    seekbar.addEventListener("mousemove", (e)=>{
        let hoverValue=(e.offsetX / e.target.clientWidth) *  parseInt(e.target.getAttribute('max'),10);
        seekbar.title=Utils.durationToText(hoverValue);
    });

    seekbar.addEventListener("focus", ()=>{
        seekbar.blur();
    });

    segmentSelector.setFocusable(false);

    segmentSelector.onValueUpdate=function(startVal, endVal) {
        let durationStartParams=Utils.splitDurationParams(startVal);
        for(let i=0;i<durationStartParams.length;i++)
            segmentStartInpElements[i].value=durationStartParams[i];

        let durationEndParams=Utils.splitDurationParams(endVal);
        for(let i=0;i<durationEndParams.length;i++) {
            segmentEndInpElements[i].value=durationEndParams[i];
        }

        document.getElementById("container").focus();
    }
}

function initializeGlobalControls() {

    jumpPointertoStartBtn.addEventListener("click", ()=>{
        audioPlayer.currentTime=segmentSelector.getStartValue()/10;
    });

    jumpPointertoEndBtn.addEventListener("click", ()=>{
        audioPlayer.currentTime=segmentSelector.getEndValue()/10;
    })

    for(let pointerPositionDisplayElement of pointerPositionDisplayElements) {
        pointerPositionDisplayElement.addEventListener("change", ()=>{
            audioPlayer.currentTime=getPointerDuration()/10;
        })
    }

    audioInp.addEventListener("change", (event)=>{
        let files=event.target.files;
        if(files==null || files.length<1) 
            return;
        if(files[0].name.split(".").pop().toLowerCase()!="mp3") {
            showToast("Please select an mp3 file");
            return;
        }
        audioPlayer.src=URL.createObjectURL(files[0]);               
        for(let titleDisplay of titleDisplays)
            titleDisplay.textContent=files[0].name.split(/(\\|\/)/g).pop();
        isAudioSelected=true;
        downloadSegmentationLink.setAttribute("download", files[0].name.split(/(\\|\/)/g).pop()+".json");
    });

    lyricsInp.addEventListener("change", (event)=>{
        let files=event.target.files;
        if(files==null || files.length<1) 
            return;
        if(files[0].size>(500*1024)) {
            showToast("File too large!");
            return;
        }
        let fileReader=new FileReader(files);
        fileReader.addEventListener("load", (event)=>{
            lyricsDisplay.innerText=event.target.result
        });
        fileReader.readAsText(files[0]);
        isLyricsSelected=true;
    });
   
    addArtistButton.addEventListener("click", ()=>{
        let options=segmentArtistField.getElementsByTagName("option");
        let newArtistVal=Utils.filterName(addArtistField.value);
        if(newArtistVal.length===0) {
            showToast("Artist name cannot be left blank");
            return;
        }
        for(let option of options) {
            if(option.value==newArtistVal) {
                showToast("Artist already exists!");
                return;
            }
        }
        let option=document.createElement("option");
        option.value=newArtistVal;
        option.innerText=newArtistVal;
        segmentArtistField.appendChild(option);
        addArtistField.value="";
    });
}

function initialzeSegmentControls() {

    //Initialsize List Choice
    let listChoices=document.getElementsByClassName("listChoice");
    for(let listChoice of listChoices) {
        let list=listChoice.getElementsByTagName("ul")[0];
        list.addEventListener("DOMSubtreeModified", (event)=>{
            let listElems=event.target.getElementsByTagName("li");
            for(listElem of listElems) {
                listElem.getElementsByTagName("button")[0].onclick=(event)=>{
                    segmentArtists.splice(segmentArtists.indexOf(event.target.parentNode.getElementsByTagName("span")[0].innerText), 1);
                    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
                };
            }
        })
    }

    jumpSegmentStartInp.addEventListener("click", ()=>{
        let newDuration=getPointerDuration();
        if(newDuration>(segmentSelector.getEndValue()-rangeSelectorMinDiff))
            showToast("Duration larger than end duration");
        else
            segmentSelector.setStartValue(getPointerDuration());
    });

    jumpSegmentEndInp.addEventListener("click", ()=>{
        let newDuration=getPointerDuration();
        if(newDuration<(segmentSelector.getStartValue()+rangeSelectorMinDiff))
            showToast("Duration less than start value");
        else
            segmentSelector.setEndValue(getPointerDuration());
    });

    for(let segmentStartInpElement of segmentStartInpElements) {
        segmentStartInpElement.addEventListener("change", ()=>{
            segmentSelector.setStartValue(getSegmentSelectorStartDuration());
        });
    }

    for(let segmentEndInpElement of segmentEndInpElements) {
        segmentEndInpElement.addEventListener("change", ()=>{
            segmentSelector.setEndValue(getSegmentSelectorEndDuration());
        });
    }

    addSegmentArtistBtn.addEventListener("click", ()=>{
        if(segmentArtistField.value==null || segmentArtistField.value=="{[Hint]}")
            showToast("Please Select An Artist");
        else {
            if(!segmentArtists.includes(segmentArtistField.value)) {
                if(segmentArtists[0]==="{[BGM]}") {
                    showToast("Other artists cannot be included with Background Music");
                } else if(segmentArtistField.value=="{[BGM]}" && segmentArtists.length>0) {
                    showToast("Background Music cannot be included with other artists");
                } else {
                    segmentArtists.unshift(segmentArtistField.value);
            
                    let newArtistElem=document.createElement("li");
                    let newArtistLabel=document.createElement("span");
                    let newArtistRemoveButton=document.createElement("button");
                    
                    newArtistLabel.innerText=segmentArtistField.value;
                    newArtistElem.appendChild(newArtistLabel);
                    newArtistElem.appendChild(newArtistRemoveButton);
        
                    segmentArtistsDisplay.getElementsByTagName("ul")[0].prepend(newArtistElem);
                }
            } else {
                showToast("Artist already exists!");
            }
            
            segmentArtistField.value="{[Hint]}";
        }
    });

    addSegmentArtistAndMarkBtn.addEventListener("click", (e)=>{
        if(segmentArtistField.value==null || segmentArtistField.value=="{[Hint]}")
            showToast("Please Select An Artist");
        else {
            if(!segmentArtists.includes(segmentArtistField.value)) {
                if(segmentArtists[0]==="{[BGM]}") {
                    showToast("Other artists cannot be included with Background Music");
                } else if(segmentArtistField.value=="{[BGM]}" && segmentArtists.length>0) {
                    showToast("Background Music cannot be included with other artists");
                } else {
                    segmentArtists.unshift(segmentArtistField.value);
            
                    let newArtistElem=document.createElement("li");
                    let newArtistLabel=document.createElement("span");
                    let newArtistRemoveButton=document.createElement("button");
                    
                    newArtistLabel.innerText=segmentArtistField.value;
                    newArtistElem.appendChild(newArtistLabel);
                    newArtistElem.appendChild(newArtistRemoveButton);
        
                    segmentArtistsDisplay.getElementsByTagName("ul")[0].prepend(newArtistElem);

                    addSegmentButton.click();
                }
            } else {
                showToast("Artist already exists!");
            }
            
            segmentArtistField.value="{[Hint]}";
        }
    });

    addSegmentButton.addEventListener("click", ()=>{
        if(!isAudioSelected)
            showToast("Audio not Loaded!");
        else if(!isLyricsSelected)
            showToast("Lyrics Not Loaded");
        else {
            if(segmentArtists.length<=0) {
                showToast("Please add some artists");
            } else if(segmentArtists.length==1 && segmentArtists[0]==="{[BGM]}") {
                if(selectedEntry==null)
                    addSegment();
                else
                    modifySegment();
            } else {
                let selection=window.getSelection();
                if(selection.toString()==null || selection.toString().length<=0) {
                    if(selectedEntry==null) {
                        showToast("Select part of lyrics");
                    } else {
                        modifySegment();
                    }
                } else if((selection.anchorNode==lyricsDisplay || selection.anchorNode.parentElement==lyricsDisplay) && (selection.focusNode==lyricsDisplay || selection.focusNode.parentElement==lyricsDisplay)) {
                    if(segmentArtists.length<=0) {
                        showToast("Please add some artists!");
                    } else {
                        if(selectedEntry==null) {
                            addSegment(selection.toString());
                        } else {
                            modifySegment(selection.toString());
                        }
                    }
                } else {
                    showToast("Please select only lyrics!");
                }
            }
        }
    });
}

function initialzeReferenceControls() {
    downloadSegmentationButton.addEventListener("click", ()=>{
        let segmentationData=[];
        for(let tr of segmentResultDisplay.children) {
            segmentationData.push(tr.segment);
        }
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(segmentationData));
        downloadSegmentationLink.setAttribute("href", dataStr);
        downloadSegmentationLink.click();
    });

    segmentResultDisplay.addEventListener("DOMSubtreeModified", ()=>{
        let rows=segmentResultDisplay.getElementsByTagName("tr");
        for(let row of rows) {
            row.onclick=function() {
                if(selectedEntry!=null) {
                    selectedEntry.style.background="";
                }

                if(selectedEntry==this) {
                    selectedEntry=null;
                    restoreWorkingData();
                } else {
                    selectedEntry=this;
                    selectedEntry.style.background="#fff7a2";
                    showSegmentEditView(selectedEntry);
                }
            }
        }
    });
}

function getPointerDuration() {
    let mins=pointerPositionDisplayElements[0].value;
    let secs=pointerPositionDisplayElements[1].value;
    let dSecs=pointerPositionDisplayElements[2].value;

    return Utils.mergeDurationParams(mins, secs, dSecs);
}

function getSegmentSelectorStartDuration() {
    let mins=segmentStartInpElements[0].value;
    let secs=segmentStartInpElements[1].value;
    let dSecs=segmentStartInpElements[2].value;

    return Utils.mergeDurationParams(mins, secs, dSecs);
}

function getSegmentSelectorEndDuration() {
    let mins=segmentEndInpElements[0].value;
    let secs=segmentEndInpElements[1].value;
    let dSecs=segmentEndInpElements[2].value;

    return Utils.mergeDurationParams(mins, secs, dSecs);
}

function addSegment(lyrics) {
    let segment={
        start: segmentSelector.getStartValue(),
        end: segmentSelector.getEndValue(),
        artists: segmentArtists
    };

    if(lyrics!=null) {
        segment.lyrics=lyrics.trim();
    }

    let tr=document.createElement("tr");
    let startCell=document.createElement("td");
    let endCell=document.createElement("td");
    let artistsCell=document.createElement("td");
    let showLyricsButton=document.createElement("button");

    startCell.innerText=Utils.durationToText(segment.start);
    endCell.innerText=Utils.durationToText(segment.end);
    segment.artists.forEach(artist => artistsCell.innerText+=artist+", ");
    showLyricsButton.innerText="Show Lyrics";
    showLyricsButton.addEventListener("click", (e)=>{
        let lyrics=e.target.parentElement.segment.lyrics;
        showDialog(segment.lyrics, "Segment Lyrics");
    });

    tr.segment=segment;
    tr.appendChild(startCell);
    tr.append(endCell);
    tr.appendChild(artistsCell);
    tr.appendChild(showLyricsButton);

    segmentResultDisplay.appendChild(tr);

    segmentArtists=[];
    segmentArtistsDisplay.getElementsByTagName("ul")[0].innerHTML="";
    segmentSelector.fixStart(segment.end);
}

function modifySegment(lyrics) {
    selectedEntry.segment.start=segmentSelector.getStartValue();
    selectedEntry.segment.end=segmentSelector.getEndValue();
    selectedEntry.segment.artists=segmentArtists;

    if(lyrics!=null) {
        selectedEntry.segment.lyrics=lyrics;
    }
    if(selectedEntry.segment.artists.length===1 && selectedEntry.segment.artists[0]=="{[BGM]}") {
        delete selectedEntry.segment.lyrics;
    }
    
    selectedEntry.children[0].innerText=Utils.durationToText(selectedEntry.segment.start);
    selectedEntry.children[1].innerText=Utils.durationToText(selectedEntry.segment.end);
    selectedEntry.children[2].innerText="";
    selectedEntry.segment.artists.forEach((artist)=> selectedEntry.children[2].innerText+=artist+", ");

    //Adjust neighour values
    if(selectedEntry.previousElementSibling!=null) {
        selectedEntry.previousElementSibling.segment.end=selectedEntry.segment.start;
        selectedEntry.previousElementSibling.children[1].innerText=Utils.durationToText(selectedEntry.segment.start);
    }

    if(selectedEntry.nextElementSibling!=null) {
        selectedEntry.nextElementSibling.segment.start=selectedEntry.segment.end;
        selectedEntry.nextElementSibling.children[0].innerText=Utils.durationToText(selectedEntry.segment.end);
    } else {
        workingData.startFixVal=selectedEntry.segment.end;
    }
    
    selectedEntry.click();
}

function showToast(text) {
    if(isToastDisplayed) {
        clearInterval(toastInterval);
    }
    isToastDisplayed=true;
    let toastBox=document.getElementById("toastBox");
    let toastDisplay=toastBox.children[0];
    toastBox.style.display="block";
    toastDisplay.innerText=text;
    let opacity=255;
    toastInterval=setInterval(()=>{
        if(opacity<=0) {
            toastBox.style.display="none";
            isToastDisplayed=false;
            clearInterval(toastInterval);
        }
        opacity-=1;
        toastDisplay.style.background="#000000"+opacity.toString(16);
    }, 10);
}

function showDialog(message, title) {
    let dialog=document.getElementById("dialog");
    dialog.getElementsByTagName("p")[0].innerText=message;
    if(title!=null)
        dialog.getElementsByTagName("h3")[0].innerText=title;
    dialog.style.display="block";
}


//Change Segment Info
function showSegmentEditView(tableRow) {
    if(workingData===null) {
        workingData={
            start: getSegmentSelectorStartDuration(),
            end: getSegmentSelectorEndDuration(),
            artists: segmentArtists,
            startFixVal: segmentSelector.getStartFix()
        };
    }

    segmentArtists=tableRow.segment.artists;
    segmentArtistsDisplay.getElementsByTagName("ul")[0].innerHTML="";

    tableRow.segment.artists.forEach((artist)=>{
        let newArtistElem=document.createElement("li");
        let newArtistLabel=document.createElement("span");
        let newArtistRemoveButton=document.createElement("button");
                    
        newArtistLabel.innerText=artist;
        newArtistElem.appendChild(newArtistLabel);
        newArtistElem.appendChild(newArtistRemoveButton);
        
        segmentArtistsDisplay.getElementsByTagName("ul")[0].appendChild(newArtistElem);
    });

    segmentSelector.clearFix();
    segmentSelector.setRange(tableRow.segment.start, tableRow.segment.end);

    //Change Style
    let backgroundColor="#fff7a2";
    for(segmentStartInpElement of segmentStartInpElements)
        segmentStartInpElement.style.background=backgroundColor;
    for(segmentEndInpElement of segmentEndInpElements) 
        segmentEndInpElement.style.background=backgroundColor;
    segmentArtistsDisplay.getElementsByTagName("ul")[0].style.background=backgroundColor;
}

function restoreWorkingData() {

    segmentArtists=workingData.artists;
    segmentArtistsDisplay.getElementsByTagName("ul")[0].innerHTML="";

    workingData.artists.forEach((artist)=>{
        let newArtistElem=document.createElement("li");
        let newArtistLabel=document.createElement("span");
        let newArtistRemoveButton=document.createElement("button");
                    
        newArtistLabel.innerText=artist;
        newArtistElem.appendChild(newArtistLabel);
        newArtistElem.appendChild(newArtistRemoveButton);
        
        segmentArtistsDisplay.getElementsByTagName("ul")[0].appendChild(newArtistElem);
    });

    segmentSelector.fixStart(workingData.startFixVal);
    segmentSelector.setEndValue(workingData.end);
    segmentSelector.setStartValue(workingData.start);

    //Change Style
    for(segmentStartInpElement of segmentStartInpElements)
        segmentStartInpElement.style.background="";
    for(segmentEndInpElement of segmentEndInpElements) 
        segmentEndInpElement.style.background="";
    segmentArtistsDisplay.getElementsByTagName("ul")[0].style.background="";

    workingData=null;
}