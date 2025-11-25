import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MoodContext } from '../context/MoodContext';

function HistoryScreen() {
  const { state } = useContext(MoodContext);
  const { entries, loading } = state;

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!entries.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No entries yet 📝</Text>
        <Text style={styles.emptySubText}>
          Go back and write about how you feel today.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const emoji =
      item.sentiment === 'positive'
        ? '😊'
        : item.sentiment === 'negative'
        ? '😔'
        : '😐';

    return (
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        <Text style={styles.itemText} numberOfLines={3}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7F1E8',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    backgroundColor: '#F7F1E8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 15,
    color: '#4A433C',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A433C',
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 13,
    color: '#8A8178',
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#FBF7F1',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  emoji: {
    fontSize: 22,
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#9A8F86',
  },
  itemText: {
    fontSize: 14,
    color: '#4A433C',
  },
});

export default HistoryScreen;
