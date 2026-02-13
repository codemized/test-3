'use client';

import { useState } from 'react';

interface Email {
  id: number;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
}

const mockEmails: Email[] = [
  {
    id: 1,
    from: 'admin@cyberspace.net',
    subject: 'SISTEMA ACTUALIZADO - V3.0',
    preview: 'El sistema ha sido actualizado exitosamente. Nuevas características disponibles...',
    date: '2084.03.15',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    from: 'neural@matrix.io',
    subject: 'Conexión neural establecida',
    preview: 'Tu interfaz neural está lista para ser utilizada. Accede al puerto...',
    date: '2084.03.14',
    read: true,
    priority: 'normal'
  },
  {
    id: 3,
    from: 'security@firewall.sys',
    subject: 'ALERTA: Intento de acceso detectado',
    preview: 'Se detectó un intento de acceso no autorizado en tu terminal...',
    date: '2084.03.14',
    read: false,
    priority: 'urgent'
  },
  {
    id: 4,
    from: 'data@cloud.node',
    subject: 'Backup completado',
    preview: 'El respaldo de datos se completó correctamente. 2.5TB sincronizados...',
    date: '2084.03.13',
    read: true,
    priority: 'normal'
  },
  {
    id: 5,
    from: 'quantum@processor.dev',
    subject: 'Procesamiento cuántico disponible',
    preview: 'Tu cuenta ahora tiene acceso a procesadores cuánticos de nueva generación...',
    date: '2084.03.12',
    read: true,
    priority: 'normal'
  },
  {
    id: 6,
    from: 'ai@assistant.bot',
    subject: 'Informe semanal de actividad',
    preview: 'Resumen de tu actividad: 247 comandos ejecutados, 98.7% de éxito...',
    date: '2084.03.11',
    read: false,
    priority: 'normal'
  },
  {
    id: 7,
    from: 'network@sync.hub',
    subject: 'Sincronización completada',
    preview: 'Todos tus dispositivos están sincronizados y conectados a la red...',
    date: '2084.03.10',
    read: true,
    priority: 'normal'
  },
  {
    id: 8,
    from: 'crypto@wallet.chain',
    subject: 'Transacción confirmada',
    preview: 'Tu transacción de 500 CyberCoins ha sido confirmada en la blockchain...',
    date: '2084.03.09',
    read: true,
    priority: 'high'
  }
];

export default function Home() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) {
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
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
          <div className="text-neon-pink text-sm md:text-lg font-retro">
            &gt; {unreadCount} NUEVOS
          </div>
        </div>
        <p className="text-center text-neon-purple text-sm md:text-xl neon-glow font-retro">
          &gt; SISTEMA DE MENSAJES :: TERMINAL 7 &lt;
        </p>
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
            {emails.map((email) => (
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
                  <div className="text-neon-cyan text-xs font-retro opacity-70">
                    {email.date}
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
                    <div className="text-neon-purple">
                      FECHA: <span className="text-neon-pink">{selectedEmail.date}</span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="text-neon-cyan font-retro leading-relaxed">
                  <p className="mb-4">&gt; {selectedEmail.preview}</p>
                  <p className="mb-4 opacity-80">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                  <p className="opacity-80">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse 
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
                    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.
                  </p>
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
