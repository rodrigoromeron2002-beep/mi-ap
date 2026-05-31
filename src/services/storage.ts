import AsyncStorage from '@react-native-async-storage/async-storage';

const PLANS_KEY = 'Zentra_PLANS';

export async function savePlan(plan: any) {
  try {
    const existing = await AsyncStorage.getItem(PLANS_KEY);

    const plans = existing ? JSON.parse(existing) : [];

    plans.unshift({
      ...plan,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    });

    await AsyncStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  } catch (error) {
    console.log('Error guardando plan:', error);
  }
}