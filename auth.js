// auth.js - система аутентификации
class AuthSystem {
    constructor() {
        this.accounts = JSON.parse(localStorage.getItem('nerolexAccounts')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('nerolexUserData')) || null;
    }

    // Загрузка аккаунтов из файла
    async loadAccounts() {
        try {
            const response = await fetch('accounts.json');
            const data = await response.json();
            this.accounts = data.users;
            localStorage.setItem('nerolexAccounts', JSON.stringify(this.accounts));
        } catch (error) {
            console.error('Ошибка загрузки аккаунтов:', error);
        }
    }

    // Регистрация нового пользователя
    register(username, password, email) {
        if (this.accounts.find(acc => acc.username === username)) {
            return { success: false, message: 'Пользователь уже существует' };
        }

        const newUser = {
            username,
            password,
            email,
            balance: 100,
            clickerData: {
                coins: 0,
                clickPower: 1,
                totalClicks: 0,
                autoClickerLevel: 0
            },
            purchasedItems: []
        };

        this.accounts.push(newUser);
        localStorage.setItem('nerolexAccounts', JSON.stringify(this.accounts));
        
        return { success: true, message: 'Регистрация успешна' };
    }

    // Авторизация пользователя
    login(username, password) {
        const user = this.accounts.find(acc => acc.username === username && acc.password === password);
        
        if (user) {
            // Не храним пароль в данных сессии
            const { password, ...userWithoutPassword } = user;
            this.currentUser = userWithoutPassword;
            localStorage.setItem('nerolexUserData', JSON.stringify(this.currentUser));
            return { success: true, message: 'Вход выполнен успешно' };
        } else {
            return { success: false, message: 'Неверное имя пользователя или пароль' };
        }
    }

    // Выход пользователя
    logout() {
        this.currentUser = null;
        localStorage.removeItem('nerolexUserData');
    }

    // Проверка, авторизован ли пользователь
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Получение текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    }

    // Обновление данных пользователя
    updateUser(userData) {
        const index = this.accounts.findIndex(acc => acc.username === userData.username);
        if (index !== -1) {
            // Сохраняем пароль
            const password = this.accounts[index].password;
            this.accounts[index] = { ...userData, password };
            localStorage.setItem('nerolexAccounts', JSON.stringify(this.accounts));
            
            // Обновляем текущего пользователя
            if (this.currentUser && this.currentUser.username === userData.username) {
                this.currentUser = userData;
                localStorage.setItem('nerolexUserData', JSON.stringify(this.currentUser));
            }
        }
    }
}

// Создаем глобальный экземпляр системы аутентификации
window.authSystem = new AuthSystem();