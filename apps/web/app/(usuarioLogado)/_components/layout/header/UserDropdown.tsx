'use client';

import { useUser } from '@/context/user-context';

import { 
  User, 
  Settings, 
  Bell, 
  LogOut, 
  Fingerprint, 
  Store, 
  Users 
} from 'lucide-react';

export default function UserDropdown() {
  const { usuario, logout } = useUser();

  const menuItems = [
    { icon: User, label: 'Meu Perfil' },
    { icon: Settings, label: 'Configurações' },
    { icon: Bell, label: 'Notificações' },
  ];

  return (
    <div
      className="absolute right-0 top-full mt-2 w-72 z-100 bg-(--Layout) backdrop-blur-md rounded-xl shadow-2xl border border-border/50 py-2 animate-in fade-in zoom-in-95 duration-200"
    >


      {/* Dados do usuário (Cards de info rápida) */}
      <div className="px-3 py-3 border-b border-(--Text)/10 bg-transparent">

        <div className="grid gap-2">

          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2 text-(--Text)/70">
              <Fingerprint size={14} />
              <span className="text-xs">Código</span>
            </div>
            <span className="text-xs font-bold text-(--Text)">{usuario?.codFuncionario}</span>
          </div>
          
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2 text-(--Text)/70">
              <Store size={14} />
              <span className="text-xs">Loja</span>
            </div>
            <span className="text-xs font-bold text-(--Text)">{usuario?.codLoja}</span>
          </div>

          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2 text-(--Text)/70">
              <Users size={14} />
              <span className="text-xs">Grupo</span>
            </div>
            <span className="text-xs font-bold text-(--Text) truncate ">
              {usuario?.pwNomeGrupo}
            </span>
          </div>
        </div>
      </div>

      {/* Menu de opções */}
      <div className="py-2 px-1">
        {menuItems.map((item, idx) => (
          <button 
            key={idx}
            disabled
            className="w-full text-left px-3 py-2 text-sm text-(--Text)/70 hover:bg-muted/50 rounded-lg flex items-center justify-between group transition-colors cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <item.icon size={16} className="text-muted-foreground group-hover:text-(--Text)" />
              <span>{item.label}</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-tighter bg-(--ThemaVermelho)/10 text-(--ThemaVermelho) px-1.5 py-0.5 rounded border border-(--ThemaVermelho)/20">
              Em desenvolvimento
            </span>
          </button>
        ))}
      </div>

      {/* Sair */}
      <div className="px-1 mt-1 pt-1 border-t border-border/50">
        <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-colors font-medium">
          <LogOut size={16} />
          <span>Sair da conta</span>
        </button>
      </div>
    </div>
  );
}