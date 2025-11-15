import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

interface Activity {
  id: number;
  name: string;
  city: string;
  action: string;
  timeAgo: string;
}

const names = ['Maria', 'João', 'Ana', 'Pedro', 'Carla', 'Lucas', 'Juliana', 'Rafael', 'Fernanda', 'Carlos'];
const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Curitiba', 'Porto Alegre', 'Salvador', 'Fortaleza', 'Recife', 'Goiânia'];
const actions = ['criou seu currículo', 'baixou template Premium', 'conseguiu entrevista', 'foi contratado(a)'];

export const LiveActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [visible, setVisible] = useState(false);

  const generateActivity = (): Activity => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomMinutes = Math.floor(Math.random() * 59) + 1;

    return {
      id: Date.now(),
      name: randomName,
      city: randomCity,
      action: randomAction,
      timeAgo: `há ${randomMinutes} min`
    };
  };

  useEffect(() => {
    // Mostrar primeira atividade após 3 segundos
    const initialTimeout = setTimeout(() => {
      setActivities([generateActivity()]);
      setVisible(true);
    }, 3000);

    // Adicionar nova atividade a cada 8-12 segundos
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => {
        const updated = [newActivity, ...prev].slice(0, 3); // Manter apenas 3 últimas
        return updated;
      });
      setVisible(true);

      // Esconder após 5 segundos
      setTimeout(() => setVisible(false), 5000);
    }, Math.random() * 4000 + 8000); // 8-12 segundos

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!visible || activities.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm animate-slide-in-left">
      <div className="bg-white rounded-xl shadow-2xl p-4 border-l-4 border-emerald-500">
        {activities.slice(0, 1).map((activity) => (
          <div key={activity.id} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {activity.name} de {activity.city}
              </p>
              <p className="text-xs text-gray-600">
                {activity.action} {activity.timeAgo}
              </p>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveActivityFeed;
