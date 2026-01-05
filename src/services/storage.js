const STORAGE_KEYS = {
  COMPANY_INFO: 'integraprice_company_info',
  FIXED_COSTS: 'integraprice_fixed_costs',
  TAXES: 'integraprice_taxes',
  SALES_FEES: 'integraprice_sales_fees',
  SAVED_PRODUCTS: 'integraprice_saved_products',
  USER_SESSION: 'integraprice_user_session'
};

export const storageService = {
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage', error);
    }
  },

  load: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from storage', error);
      return defaultValue;
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },

  // Specialized methods for our app entities
  saveCompanyData: (data) => {
    storageService.save(STORAGE_KEYS.COMPANY_INFO, data.companyInfo);
    storageService.save(STORAGE_KEYS.FIXED_COSTS, data.fixedCosts);
    storageService.save(STORAGE_KEYS.TAXES, data.taxes);
    storageService.save(STORAGE_KEYS.SALES_FEES, data.salesFees);
  },

  loadCompanyData: () => {
    return {
      companyInfo: storageService.load(STORAGE_KEYS.COMPANY_INFO),
      fixedCosts: storageService.load(STORAGE_KEYS.FIXED_COSTS),
      taxes: storageService.load(STORAGE_KEYS.TAXES),
      salesFees: storageService.load(STORAGE_KEYS.SALES_FEES),
    };
  },

  saveProducts: (products) => {
    storageService.save(STORAGE_KEYS.SAVED_PRODUCTS, products);
  },

  loadProducts: () => {
    return storageService.load(STORAGE_KEYS.SAVED_PRODUCTS, []);
  },

  saveSession: (user) => {
    storageService.save(STORAGE_KEYS.USER_SESSION, user);
  },

  loadSession: () => {
    return storageService.load(STORAGE_KEYS.USER_SESSION, null);
  },

  clearSession: () => {
    storageService.remove(STORAGE_KEYS.USER_SESSION);
  }
};
