async function NavigationGuard(to, from, next) {
    if (to?.meta?.login === true && !this.auth) {
        return next({ path: `/login?redirect=${to.fullPath}` });
    }

    if (to?.meta?.login === false && this.auth) {
        return next('/welcome');
    }

    next();
}


export default NavigationGuard;

