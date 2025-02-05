import { StyleSheet, View, Image } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { DietPlan } from '../../types/diet';

interface DietPlanCardProps {
  plan: DietPlan;
}

export function DietPlanCard({ plan }: DietPlanCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(modals)/diet-plan',
      params: { id: plan.id }
    });
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: plan.thumbnail_url }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>{plan.title}</Text>
          {plan.is_premium && (
            <Chip icon="star" mode="outlined">Premium</Chip>
          )}
        </View>
        <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
          {plan.description}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
  },
  imageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#1A1A1A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  description: {
    opacity: 0.7,
    color: '#FFFFFF',
  },
}); 