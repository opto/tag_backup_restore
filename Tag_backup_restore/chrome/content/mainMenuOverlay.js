/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */



 
//Components.utils.import("resource:///modules/StringBundle.js");
var { Services } = 
ChromeUtils.import("resource://gre/modules/Services.jsm");
//Components.utils.import("resource:///modules/gloda/indexer.js");
//Components.utils.import("resource://app/modules/MailUtils.js");
//const {classes: Cc, interfaces: Ci, utils: Cu, results : Cr} = Components;
var { Gloda } = 
ChromeUtils.import("resource:///modules/gloda/public.js");
var { iteratorUtils } = 
ChromeUtils.import("resource:///modules/iteratorUtils.jsm"); // for toXPCOMArray



 function tagBackup()
{        
  alert('Backup of tags is in file TB_tag_backup.txt on your desktop.\n\nCopy to desktop of another TB installation and restore.\n\nOnly email tags of locally available accounts and folders will be restored in that installation.\n\nRestore assumes that both TB installations have same order and name of tags.');


  let query = Gloda.newQuery(Gloda.NOUN_MESSAGE);
  let tagArray = MailServices.tags.getAllTags({});
  var noTags = tagArray.length;
  let snoTags = noTags + '\n';
  query.tags(...tagArray);
 
 let myListener = {

  onItemsAdded: function myListener_onItemsAdded(aItems, aCollection) {
  },

  onItemsModified: function myListener_onItemsModified(aItems, aCollection) {
  },

  onItemsRemoved: function myListener_onItemsRemoved(aItems, aCollection) {
  },

  onQueryCompleted: function myListener_onQueryCompleted(aCollection) {



 		try {
 //        alert(aCollection.items.length);
        let sLen=        aCollection.items.length +'\n';
        alert(sLen);

let path = Components.classes["@mozilla.org/file/directory_service;1"].getService( Components.interfaces.nsIProperties).get("Desk", Components.interfaces.nsIFile).path + "\\";    
let file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile); 

//path= path+"TB_tag_backup.txt";
file.initWithPath(path);
file.append("TB_tag_backup.txt")                                                   
if (!file.exists() ) file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0664) ;
let outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance( Components.interfaces.nsIFileOutputStream );
outputStream.init( file, 0x04 | 0x20, 0664, 0 ); //0x20 is truncate,  0x10 is append
        let sProg="TB_tag_backup" +    '\n';
        let result = outputStream.write( sProg, sProg.length );
        result = outputStream.write( sLen, sLen.length );
        result = outputStream.write( snoTags, snoTags.length );
//        				while(msg=aCollection.items.pop())
let  ausg="";
       for (var i = 0; i <aCollection.items.length; i++) 
                {
	
             let msg=   aCollection.items[i];
             if (msg.folderMessage!=null)
             {
          let tagList=  msg.folderMessage.getStringProperty("keywords");
           ausg=   i  +  ';'  + tagList  + ';' +  msg.headerMessageID + ';' +    msg.messageKey+   ';'  + msg.folderURI +';' + msg._isDeleted + 
                        ';' + msg.subject +      ';'   +   msg.folderMessage.folder.name + ';'  +   msg.folderMessage.folder.parent.name
                                   + ';\n' ;
//          alert (ausg);     
//';' +    msg.messageKey+   ';' + msg.folderURI +';' + msg._isDeleted +         + msg.account +';'
 //                       ';' + msg.subject +      ';'  +   msg.folderMessage.folder.parent.parent.name 
}
else
{
           ausg=   i  +  ';'  +   'foldermessage null'  + ';' +  msg.headerMessageID + ';' +    msg.messageKey+   ';' + msg.folderURI +';' + msg._isDeleted + 
                        ';' + msg.subject + '\n' ;

}
 result = outputStream.write( ausg, ausg.length );
 if (!result) alert("File with email tags could not be written");


			}
  
    	} catch (e) {alert("Could not create backup of  email tags");}	



  }
};
 
let collection = query.getCollection(myListener);






 };


function tagRestore()
{
let answer = confirm('Do you want to restore tags to emails?\n\nExisting tags will stay, new tags will be added.\n\nBackup of tags must be in file TB_tag_backup on your desktop.\n\If email does not exist in this TB, it will be ignored.\n\nRestore assumes that both TB installations have same order and name of tags.\n\n Number of tags in this TB must be equal or larger than in source-TB');

if (answer)
{
 /*	*/	
 let tagArray = MailServices.tags.getAllTags({});
 var noTagsInTB2 = tagArray.length;
 var omsgHdrID;
 var omsgFoldername;
 var omsgFolderParentName;
 var omsgFolderURI;
 var omsgTags;

  
 let path = Components.classes["@mozilla.org/file/directory_service;1"].getService( Components.interfaces.nsIProperties).get("Desk", Components.interfaces.nsIFile).path + "\\";    

let file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile); 
 
 file.initWithPath(path);
file.append("TB_tag_backup.txt");
//if (file.exists() ) alert("da");
 
 
 // open an input stream from file
let istream = Components.classes["@mozilla.org/network/file-input-stream;1"].
              createInstance(Components.interfaces.nsIFileInputStream);
istream.init(file, 0x01, 0444, 0);
istream.QueryInterface(Components.interfaces.nsILineInputStream);

// read lines into array
let line = {}, lines = [], hasmore, iNoLines, hdrIDs = [];
var msgTagInfo = [];
var msgFolderName = [];
var msgFolderParentName = [];
var msgAll = [];
  hasmore = istream.readLine(line);
//  alert(line.value) ;
  if (line.value == "TB_tag_backup" ) 
{  
//alert("file ok");
hasmore=  istream.readLine(line);
let iNoLines= parseInt(line.value);

//alertMsg="Restoring tags for " +  iNoLines + " emails" ;
//alert(alertMsg);
hasmore=  istream.readLine(line);
let iNoTagsInTB1= parseInt(line.value);
if (iNoTagsInTB1 > noTagsInTB2) 
{
  alertMsg= "number of defined tags in source-TB is larger than number of tags in this TB.\n\nRequired number of tags: " + NoTagsInTB1;
  alert(alertMsg);
  //alert(iNoTagsInTB1);
  return;
}
do {
  hasmore = istream.readLine(line);
  lines= line.value.split(";");    
  if (lines[1] !=  'foldermessage null') 
  { 
     hdrIDs.push(lines[2]);
    //  msgTagInfo[lines[1]]  =  lines[0];
    //  msgFolderName[lines[1]] = lines[2];
    //  msgFolderParentName[lines[1]] = lines[3];  
     msgAll.push( {hdrID:lines[2],Foldername:lines[7],FolderParentnane:lines[8],FolderURI:lines[4], tags:lines[1] });
  
  }

} while(hasmore);
alertMsg="Found tags for " +  hdrIDs.length + " emails" ;
alert(alertMsg);



   let query = Gloda.newQuery(Gloda.NOUN_MESSAGE);

  query.headerMessageID(...hdrIDs);
 
 let myListener = {

  onItemsAdded: function myListener_onItemsAdded(aItems, aCollection) {
  },

  onItemsModified: function myListener_onItemsModified(aItems, aCollection) {
  },

  onItemsRemoved: function myListener_onItemsRemoved(aItems, aCollection) {
  },

  onQueryCompleted: function myListener_onQueryCompleted(aCollection) {
  //alert("query");
  //alert(aCollection.items.length);
  //var msgs =Components.classes["@mozilla.org/array;1"].createInstance(Components.interfaces.nsIMutableArray);
  
        				while(msg=aCollection.items.pop()){
         //alert(msgTagInfo[msg.headerMessageID]);
         //alert(msg.folderMessage.folder.name);
         //alert(msgFolderName[msg.headerMessageID]);
         //alert("next");
         //alert(msg.folderMessage.folder.parentMsgFolder.name);
         //alert(msg.folderMessage.folder.parent.name);
         ////alert(msg.folderMessage.messageKey);
         //alert(msg.folderMessage.folder.hostnamey);
         //alert (  (msg.folderMessage.folder.GetMessageHeader(msg.folderMessage.messageKey)).messageKey  )
                 if (msg.folderMessage==null) alert("header null");
                 else
                 {
 //        msgs.clear();
    //                  ohdr=msg.folderMessage.folder.GetMessageHeader(msg.folderMessage.messageKey);
     //                 msgs.appendElement(ohdr);
                    omsgHdrID=msg.headerMessageID;
                    omsgFoldername=msg.folderMessage.folder.name;
                    omsgFolderParentName=msg.folderMessage.folder.parent.name;
                    omsgFolderURI= msg.folderURI;
                    let resarr=msgAll.filter(function (e) 
                      { 
                     
                      let found =
                         (e.hdrID== omsgHdrID )&&
                              ( e.Foldername== omsgFoldername) &&
                               (e.FolderParentnane  == omsgFolderParentName) &&
                               (e.FolderURI  ==  omsgFolderURI)  ;
                               if (found) omsgTags=e.tags;// alert(e.hdrID);
                               return found;
                      });
//                     if ((msg.folderMessage.folder.name==msgFolderName[msg.headerMessageID])
//                  && (msg.folderMessage.folder.parent.name==msgFolderParentName[msg.headerMessageID])   )
//                    alert(resarr.length);
                    if (resarr.length>0)
                        {
                        //alert(omsgHdrID);
                          //msg.folderMessage.setStringProperty("keywords", msgTagInfo[msg.headerMessageID]);

                          let msgHdra = toXPCOMArray([msg.folderMessage], Ci.nsIMutableArray);
                          msg.folderMessage.folder.addKeywordsToMessages(msgHdra,omsgTags);
                          msg.folderMessage.folder.msgDatabase = null;
                        } 
                  }
}
alert("finished restoring tags");
  }

  
  };

let collection = query.getCollection(myListener);

}

istream.close();


  


}
else
{
};

};

