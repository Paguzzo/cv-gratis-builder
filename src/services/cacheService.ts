import { CurriculumData } from '@/types/curriculum';

/**
 * 💾 CACHE SERVICE - Sistema de cache inteligente para dados do usuário
 * 
 * Funcionalidades:
 * - Cache de dados do currículo com expiração
 * - Cache de templates acessados
 * - Invalidação inteligente
 * - Compressão de dados grandes
 * - Analytics de performance
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milliseconds
  version: string;
  accessCount: number;
  lastAccessed: number;
}

interface TemplateData {
  id: string;
  name: string;
  content: string;
  [key: string]: unknown;
}

interface UserPreferences {
  theme?: string;
  language?: string;
  defaultTemplate?: string;
  [key: string]: unknown;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  totalSize: number;
  hitRate: number;
}

class CacheService {
  private static instance: CacheService;
  private readonly PREFIX = 'cvgratis_cache_';
  private readonly MAX_SIZE = 50; // Máximo de itens no cache
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalSize: 0,
    hitRate: 0
  };

  // 🕒 TTL CONFIGURATIONS (em milliseconds)
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 horas
  private readonly CURRICULUM_DATA_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias
  private readonly TEMPLATE_CACHE_TTL = 60 * 60 * 1000; // 1 hora
  private readonly USER_PREFERENCES_TTL = 30 * 24 * 60 * 60 * 1000; // 30 dias

  private constructor() {
    this.loadStats();
    this.cleanExpiredItems();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * 📝 CURRICULUM DATA CACHE
   */
  public setCurriculumData(data: CurriculumData): void {
    this.set('curriculum_data', data, this.CURRICULUM_DATA_TTL);
  }

  public getCurriculumData(): CurriculumData | null {
    return this.get('curriculum_data');
  }

  /**
   * 🎨 TEMPLATE CACHE
   */
  public setTemplate(templateId: string, templateData: TemplateData): void {
    this.set(`template_${templateId}`, templateData, this.TEMPLATE_CACHE_TTL);
  }

  public getTemplate(templateId: string): TemplateData | null {
    return this.get(`template_${templateId}`);
  }

  /**
   * ⚙️ USER PREFERENCES CACHE
   */
  public setUserPreferences(preferences: UserPreferences): void {
    this.set('user_preferences', preferences, this.USER_PREFERENCES_TTL);
  }

  public getUserPreferences(): UserPreferences | null {
    return this.get('user_preferences');
  }

  /**
   * 🔄 GENERIC CACHE OPERATIONS
   */
  private set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      const cacheKey = this.PREFIX + key;
      const now = Date.now();
      
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: now,
        ttl,
        version: '1.0.0',
        accessCount: 0,
        lastAccessed: now
      };

      // 📊 COMPRESSION: Comprimir dados grandes
      let serializedData = JSON.stringify(cacheItem);
      if (serializedData.length > 100000) { // 100KB
        console.log(`💾 Cache: Compressing large data for key ${key}`);
        serializedData = this.compress(serializedData);
      }

      localStorage.setItem(cacheKey, serializedData);
      this.updateCacheSize();
      
      console.log(`💾 Cache SET: ${key} (TTL: ${ttl / 1000 / 60}min)`);
    } catch (error) {
      console.error(`❌ Cache SET error for ${key}:`, error);
      this.handleQuotaExceeded();
    }
  }

  private get<T>(key: string): T | null {
    try {
      const cacheKey = this.PREFIX + key;
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) {
        this.stats.misses++;
        this.saveStats();
        return null;
      }

      // 📊 DECOMPRESSION: Descomprimir se necessário
      let parsedData;
      try {
        parsedData = JSON.parse(cached);
      } catch {
        // Tentar descomprimir
        parsedData = JSON.parse(this.decompress(cached));
      }

      const cacheItem = parsedData as CacheItem<T>;
      const now = Date.now();

      // ⏰ CHECK EXPIRATION
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        console.log(`💾 Cache EXPIRED: ${key}`);
        this.remove(key);
        this.stats.misses++;
        this.saveStats();
        return null;
      }

      // 📈 UPDATE ACCESS STATS
      cacheItem.accessCount++;
      cacheItem.lastAccessed = now;
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));

      this.stats.hits++;
      this.updateHitRate();
      this.saveStats();

      console.log(`💾 Cache HIT: ${key} (accessed ${cacheItem.accessCount} times)`);
      return cacheItem.data;
    } catch (error) {
      console.error(`❌ Cache GET error for ${key}:`, error);
      this.stats.misses++;
      this.saveStats();
      return null;
    }
  }

  /**
   * 🧹 CACHE MANAGEMENT
   */
  public remove(key: string): void {
    const cacheKey = this.PREFIX + key;
    localStorage.removeItem(cacheKey);
    this.updateCacheSize();
    console.log(`💾 Cache REMOVE: ${key}`);
  }

  public clear(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
    this.stats = { hits: 0, misses: 0, evictions: 0, totalSize: 0, hitRate: 0 };
    this.saveStats();
    console.log(`💾 Cache CLEARED: ${keys.length} items removed`);
  }

  public cleanExpiredItems(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
    let cleanedCount = 0;

    keys.forEach(cacheKey => {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const cacheItem = JSON.parse(cached) as CacheItem<any>;
          const now = Date.now();

          if (now - cacheItem.timestamp > cacheItem.ttl) {
            localStorage.removeItem(cacheKey);
            cleanedCount++;
          }
        }
      } catch (error) {
        // Remove itens corrompidos
        localStorage.removeItem(cacheKey);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      console.log(`💾 Cache CLEANUP: ${cleanedCount} expired items removed`);
      this.updateCacheSize();
    }
  }

  /**
   * 📊 CACHE ANALYTICS
   */
  public getStats(): CacheStats {
    return { ...this.stats };
  }

  public getStorageInfo(): { used: number; available: number; percentage: number } {
    let used = 0;
    let available = 5 * 1024 * 1024; // 5MB típico do localStorage

    try {
      // Calcular uso atual
      const allData = JSON.stringify(localStorage);
      used = new Blob([allData]).size;
      
      // Tentar estimar espaço disponível
      const testKey = 'test_storage_size';
      let testSize = 0;
      try {
        const testData = 'x'.repeat(1024); // 1KB
        while (testSize < available) {
          localStorage.setItem(testKey + testSize, testData);
          testSize += 1024;
        }
      } catch {
        available = testSize;
      } finally {
        // Limpar dados de teste
        Object.keys(localStorage)
          .filter(key => key.startsWith(testKey))
          .forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.warn('Não foi possível calcular uso do storage:', error);
    }

    return {
      used,
      available,
      percentage: Math.round((used / available) * 100)
    };
  }

  /**
   * 🔧 PRIVATE UTILITIES
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? Math.round((this.stats.hits / total) * 100) : 0;
  }

  private updateCacheSize(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
    this.stats.totalSize = keys.length;
  }

  private handleQuotaExceeded(): void {
    console.warn('💾 Cache: Storage quota exceeded, cleaning old items...');
    
    // Remover itens menos acessados
    const keys = Object.keys(localStorage)
      .filter(key => key.startsWith(this.PREFIX))
      .map(key => {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cacheItem = JSON.parse(cached) as CacheItem<any>;
            return { key, lastAccessed: cacheItem.lastAccessed, accessCount: cacheItem.accessCount };
          }
        } catch (error) {
          return { key, lastAccessed: 0, accessCount: 0 };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.accessCount - b.accessCount || a.lastAccessed - b.lastAccessed);

    // Remover 25% dos itens menos usados
    const toRemove = Math.ceil(keys.length * 0.25);
    for (let i = 0; i < toRemove && i < keys.length; i++) {
      localStorage.removeItem(keys[i]!.key);
      this.stats.evictions++;
    }

    console.log(`💾 Cache: Evicted ${toRemove} items`);
    this.updateCacheSize();
    this.saveStats();
  }

  private compress(data: string): string {
    // Implementação simples de compressão (LZ-string seria ideal)
    return btoa(data);
  }

  private decompress(data: string): string {
    return atob(data);
  }

  private loadStats(): void {
    try {
      const saved = localStorage.getItem(this.PREFIX + 'stats');
      if (saved) {
        this.stats = { ...this.stats, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Não foi possível carregar estatísticas do cache:', error);
    }
  }

  private saveStats(): void {
    try {
      localStorage.setItem(this.PREFIX + 'stats', JSON.stringify(this.stats));
    } catch (error) {
      console.warn('Não foi possível salvar estatísticas do cache:', error);
    }
  }
}

// 🌟 EXPORT SINGLETON INSTANCE
export const cacheService = CacheService.getInstance();

// 🚀 PERFORMANCE HOOKS
export const useCacheStats = () => {
  return cacheService.getStats();
};

export const useStorageInfo = () => {
  return cacheService.getStorageInfo();
}; 