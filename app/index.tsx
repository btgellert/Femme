import { Redirect } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect to login if not authenticated, or diet tab if authenticated
  return <Redirect href={'/(tabs)/diet'} />;
} 