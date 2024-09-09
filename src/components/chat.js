import React, { useState, useEffect, useRef } from 'react';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Box, TextField, Button, Paper, Typography, IconButton, Input  } from '@mui/material';
import { Avatar } from '@mui/material';
import { AttachFile } from '@mui/icons-material'; 

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null); 
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat window
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() || attachment) {
      let attachmentUrl = null;

      // If there's an attachment, upload it to Firebase Storage
      if (attachment) {
        const attachmentRef = ref(storage, `attachments/${attachment.name}`);
        const snapshot = await uploadBytes(attachmentRef, attachment);
        attachmentUrl = await getDownloadURL(snapshot.ref);
      }

      // Send message to Firestore with text and optional attachment URL
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        uid: user.uid,
        createdAt: new Date(),
        displayName: user.displayName,
        attachmentUrl, // Attach the file URL to the message
      });
      setNewMessage('');
      setAttachment(null);  // Clear the attachment after sending
    }
  };

  const handleAttachmentChange = (event) => {
    setAttachment(event.target.files[0]);  // Set the selected file
  };
  
  const isImage = (url) => {
    const extension = url.split('?')[0].split('.').pop().toLowerCase();
    return ['jpeg', 'jpg', 'gif', 'png', 'bmp', 'webp'].includes(extension);
  };

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '94vh'}}>
      <Typography variant="h5" gutterBottom>
        Chat Room
      </Typography>

      {/* Chat Window */}
      <Box 
        sx={{ flex: 1, overflowY: 'auto', mb: 3, padding: { xs: 1, sm: 3 }, border: 1, borderRadius: 5, borderColor: 'orange' }}
        ref={chatContainerRef} // Attach the ref to the chat window
      >
        {messages.map(message => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',  
              justifyContent: message.uid === user.uid ? 'flex-end' : 'flex-start',
              mb: 1,           
            }}
          >
            {message.uid !== user.uid && (
              <Avatar sx={{ mr: 2 }}>{message.displayName.charAt(0)}</Avatar>
            )}
            <Paper 
               elevation={3}
               sx={{
                 p: 2,
                 backgroundColor: message.uid === user.uid ? '#1976d2' : '#f5f5f5',
                 color: message.uid === user.uid ? 'white' : 'black',
                 maxWidth: { xs: '80%', sm: '70%' }
               }}
            >
              <Typography variant="body1">
                <strong>{message.displayName}: </strong> {message.text}
              </Typography>
              {message.attachmentUrl && (
                <Box sx={{ mt: 2 }}>
                  {/* Display an image if the attachment is an image */}
                  {isImage(message.attachmentUrl) ? (
                    <img src={message.attachmentUrl} alt="attachment" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }} />
                  ) : (
                    <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer">
                      Download attachment
                    </a>
                  )}
                </Box>
              )}
            </Paper>
            {message.uid === user.uid && (
              <Avatar sx={{ ml: 2 }}>{user.displayName.charAt(0)}</Avatar>
            )}
          </Box>     
        ))}
      </Box>

      {/* Input Box */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          variant="outlined"
        />
        {/* Attachment Button */}
        <IconButton component="label" sx={{ ml: 2 }}>
          <AttachFile />
          <Input
            type="file"
            sx={{ display: 'none' }}
            onChange={handleAttachmentChange}
          />
        </IconButton>
        <Button 
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          onClick={handleSendMessage}
          disabled={!newMessage && !attachment}  // Disable button if no message or attachment
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default Chat;
