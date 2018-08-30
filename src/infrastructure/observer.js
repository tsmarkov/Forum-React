let subscriptions = {
    'loginUser': [],
    'logoutUser': []
}

export default {
    events: {
        loginUser: 'loginUser',
        logoutUser: 'logoutUser',
    },
    subscribe: (event, fn) => {
        subscriptions[event].push(fn)
    },
    unsubscribe: (event, fn) => {
        let index = subscriptions[event].indexOf(fn);
        subscriptions[event].splice(index, 1);
    },
    trigger: (event, data) => {
        subscriptions[event].forEach(fn => fn(data))
    }
}