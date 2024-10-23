export function navigateTo(router, routeName) {
    if (router.currentRoute.value.name !== routeName) {
        router.push({ name: routeName });
    }
}
  