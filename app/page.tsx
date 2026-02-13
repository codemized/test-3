'use client';

import { useState, useEffect } from 'react';

interface Email {
  id: number;
  from: string;
  to?: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
  attachments?: string[];
}

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar emails del MCP al montar el componente
  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/emails');
      const data = await response.json();
      
      if (data.success) {
        setEmails(data.emails);
        setError(null);
      } else {
        setError('Error al cargar emails');
      }
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const getPreview = (body: string, length: number = 70) => {
    return body.length > length ? body.substring(0, length) + '...' : body;
  };

  const handleEmailClick = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) {
      // Actualizar localmente
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
      
      // Actualizar en el servidor/MCP
      try {
        await fetch('/api/emails', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailId: email.id })
        });
      } catch (err) {
        console.error('Error marking email as read:', err);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-neon-pink';
      default: return 'text-neon-cyan';
    }
  };

  const unreadCount = emails.filter(e => !e.read).length;

  return (
    <div className="min-h-screen bg-retro-dark grid-retro scan-lines p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-cyan neon-glow flicker font-retro">
            CYBER MAIL
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchEmails}
              className="px-4 py-2 border border-neon-cyan text-neon-cyan text-xs font-retro hover:bg-neon-cyan hover:text-retro-dark transition-all"
              disabled={loading}
            >
              {loading ? 'CARGANDO...' : 'ACTUALIZAR'}
            </button>
            <div className="text-neon-pink text-sm md:text-lg font-retro">
              &gt; {unreadCount} NUEVOS
            </div>
          </div>
        </div>
        <p className="text-center text-neon-purple text-sm md:text-xl neon-glow font-retro">
          &gt; SISTEMA DE MENSAJES :: TERMINAL 7 :: MCP CONECTADO &lt;
        </p>
        {error && (
          <div className="mt-4 p-3 border-2 border-red-500 bg-red-500 bg-opacity-10 text-red-500 text-center font-retro text-sm">
            ERROR: {error}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de emails */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-retro-darker border-2 border-neon-purple neon-border p-4 mb-4">
            <div className="text-neon-cyan font-retro text-sm flex justify-between">
              <span>TOTAL: {emails.length}</span>
              <span className="text-neon-pink">NO LEÍDOS: {unreadCount}</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="text-center text-neon-cyan font-retro py-8">
                <div className="animate-pulse">CARGANDO MENSAJES...</div>
              </div>
            ) : emails.length === 0 ? (
              <div className="text-center text-neon-purple font-retro py-8">
                NO HAY MENSAJES
              </div>
            ) : emails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`relative bg-retro-darker border-2 p-4 cursor-pointer
                  transition-all duration-300 hover:scale-[1.02]
                  ${selectedEmail?.id === email.id 
                    ? 'border-neon-cyan neon-border' 
                    : 'border-neon-purple'
                  }
                  ${!email.read ? 'bg-opacity-100' : 'bg-opacity-50'}
                  group`}
              >
                {/* Priority indicator */}
                <div className={`absolute top-2 left-2 text-xs font-retro ${getPriorityColor(email.priority)}`}>
                  [{email.priority.toUpperCase()}]
                </div>

                {/* Unread dot */}
                {!email.read && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full animate-pulse"></div>
                )}

                <div className="mt-6">
                  <div className="text-neon-cyan text-xs font-retro mb-1 truncate">
                    FROM: {email.from}
                  </div>
                  <h3 className={`text-sm font-retro mb-2 truncate ${
                    !email.read ? 'text-neon-pink font-bold' : 'text-neon-purple'
                  }`}>
                    {email.subject}
                  </h3>
                  <p className="text-neon-cyan text-xs opacity-50 mb-2 truncate">
                    {getPreview(email.body, 50)}
                  </p>
                  <div className="text-neon-cyan text-xs font-retro opacity-70">
                    {formatDate(email.date)}
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-cyan"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-cyan"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-cyan"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-cyan"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Email detail view */}
        <div className="lg:col-span-2">
          {selectedEmail ? (
            <div className="relative bg-retro-darker border-2 border-neon-cyan neon-border p-6 vhs-effect">
              <div className="absolute top-3 left-3 text-neon-pink text-xs font-retro">
                [MSG #{selectedEmail.id}]
              </div>

              <div className="mt-8 space-y-6">
                {/* Header */}
                <div className="border-b-2 border-neon-purple pb-4">
                  <div className={`text-xs font-retro mb-2 ${getPriorityColor(selectedEmail.priority)}`}>
                    PRIORIDAD: {selectedEmail.priority.toUpperCase()}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-retro text-neon-cyan neon-glow mb-4">
                    {selectedEmail.subject}
                  </h2>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-sm font-retro">
                    <div className="text-neon-purple">
                      DE: <span className="text-neon-cyan">{selectedEmail.from}</span>
                    </div>
                    {selectedEmail.to && (
                      <div className="text-neon-purple">
                        PARA: <span className="text-neon-cyan">{selectedEmail.to}</span>
                      </div>
                    )}
                    <div className="text-neon-purple">
                      FECHA: <span className="text-neon-pink">{formatDate(selectedEmail.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="text-neon-cyan font-retro leading-relaxed">
                  <p className="mb-4 whitespace-pre-wrap">&gt; {selectedEmail.body}</p>
                  
                  {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-neon-purple">
                      <div className="text-neon-pink text-sm mb-2">ARCHIVOS ADJUNTOS:</div>
                      <div className="space-y-2">
                        {selectedEmail.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <span className="text-neon-cyan">▶</span>
                            <span className="text-neon-purple">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-6 border-t-2 border-neon-purple">
                  <button className="px-6 py-2 bg-neon-cyan text-retro-dark font-retro text-sm 
                    hover:bg-neon-pink transition-colors duration-300">
                    RESPONDER
                  </button>
                  <button className="px-6 py-2 border-2 border-neon-purple text-neon-purple font-retro text-sm 
                    hover:border-neon-pink hover:text-neon-pink transition-colors duration-300">
                    REENVIAR
                  </button>
                  <button className="px-6 py-2 border-2 border-red-500 text-red-500 font-retro text-sm 
                    hover:bg-red-500 hover:text-retro-dark transition-colors duration-300">
                    ELIMINAR
                  </button>
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan"></div>
            </div>
          ) : (
            <div className="relative bg-retro-darker border-2 border-neon-purple neon-border p-12 
              flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="text-6xl text-neon-cyan mb-4 opacity-50">▼</div>
                <p className="text-neon-purple font-retro text-xl">
                  SELECCIONA UN MENSAJE
                </p>
                <p className="text-neon-cyan font-retro text-sm mt-2 opacity-70">
                  &gt; {emails.length} mensajes disponibles
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 border-t-2 border-neon-purple pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-retro text-xs md:text-sm">
          <div className="text-neon-cyan">
            &gt; TERMINAL: <span className="text-neon-pink">MAIL_SYS_7</span>
          </div>
          <div className="text-neon-cyan">
            VERSION 2.84.12
          </div>
          <div className="text-neon-pink animate-pulse">
            ● ONLINE
          </div>
        </div>
      </div>

      {/* Background decorative lines */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 0, 139, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00ffff;
          border: 1px solid #8b008b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff00ff;
        }
      `}</style>
    </div>
  );
}
