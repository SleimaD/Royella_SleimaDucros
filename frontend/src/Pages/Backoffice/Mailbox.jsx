import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Mailbox() {
    const [messages, setMessages] = useState([]);
    const [subjects, setSubjects] = useState({});
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/contact-messages/')
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => console.error('Error fetching messages:', error));

        axios.get('http://127.0.0.1:8000/api/contact-subjects/')
            .then(response => {
                const subjectMap = response.data.reduce((acc, cur) => {
                    acc[cur.id] = cur.subject;
                    return acc;
                }, {});
                setSubjects(subjectMap);
            })
            .catch(error => console.error('Error fetching subjects:', error));
    }, []);

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
    };

    const getSubject = (subjectId) => {
        return subjects[subjectId] || "Other";
    };

    return (
        <div className="flex h-screen bg-khaki">
            <div className="w-1/4 bg-gray-800  overflow-y-auto flex flex-col gap-2 p-2">
                <div className="p-1 py-5 text-lg font-bold uppercase font-Garamond text-center ">Messages</div>
                {messages.map(message => (
                    <div key={message.id} 
                         className={`p-4  hover:bg-gray-700  cursor-pointer ${selectedMessage && selectedMessage.id === message.id ? 'bg-white ' : ' bg-white'}`}
                         onClick={() => handleSelectMessage(message)}>
                        <h3 className="text-xl leading-6 font-bold text-gray-900">
                            Subject: <span className='font-normal text-sm'> {getSubject(message.subject)} </span> 
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            <span className='text-xl font-bold'>From:</span> {message.email}
                        </p>
                    </div>
                ))}
            </div>
            <div className="w-3/4 bg-whiteSmoke overflow-y-auto">
                <div className="p-1 py-5 text-5xl font-bold uppercase font-Garamond text-center ">Mailbox</div>
                {selectedMessage ? (
                    <div className='p-5'>
                        <p className="text-gray-700">From: <span className='text-blue-500'> {selectedMessage.email}</span></p>
                        <h3 className="">Subject : <span className='text-blue-700'> {getSubject(selectedMessage.subject)}</span></h3>
                        <div className="border-t border-gray-200 mt-4">
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex flex-col bg-white mt-2">
                                <dt className="text-sm font-medium text-gray-500">Message:</dt>
                                <br></br>
                                <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                                    {selectedMessage.message}
                                </dd>
                            </div>
                        </div>
                    </div>
                ) : <div className="text-center p-20">Select a message to view details</div>}
            </div>
        </div>
    );
}

export default Mailbox;
