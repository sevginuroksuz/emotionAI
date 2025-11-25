import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MoodContext } from '../context/MoodContext';
import { analyzeTextWithAI } from '../services/aiService';

// Duyguya göre arka plan renkleri 
const moodBackgrounds = {
  positive: '#FFD91AFF', 
  neutral:  '#C8BDADFF', 
  negative: '#414040FF', 
};

function DailyEntryScreen() {
  const mood = useContext(MoodContext);
  const { dispatch } = mood;

  const [text, setText] = useState('');
  const [lastEntry, setLastEntry] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);
    const aiResult = await analyzeTextWithAI(text.trim());
    setLoading(false);

    const entry = {
      id: Date.now().toString(),
      text: text.trim(),
      sentiment: aiResult.sentiment,
      summary: aiResult.summary,
      suggestion: aiResult.suggestion,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_ENTRY', payload: entry });
    setLastEntry(entry);
    setText('');
  };

  const sentimentEmoji =
    lastEntry?.sentiment === 'positive'
      ? '😊'
      : lastEntry?.sentiment === 'negative'
      ? '😔'
      : '😐';

  const sentimentText =
    lastEntry?.sentiment === 'positive'
      ? 'Positive'
      : lastEntry?.sentiment === 'negative'
      ? 'Negative'
      : 'Neutral';

  // ➤ Arka plan rengini duyguya göre seç
  const currentSentiment = lastEntry?.sentiment || 'neutral';
  const bgColor = moodBackgrounds[currentSentiment] || moodBackgrounds.neutral;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bgColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.appTitle}>EmotionAi</Text>
        </View>

        <Text style={styles.screenTitle}>Daily Emotion Entry</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>How are you today?</Text>
          <TextInput
            style={styles.input}
            placeholder="Write a few sentences about how you're feeling..."
            placeholderTextColor="#000000FF"
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleAnalyze}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Analysis results</Text>
          {lastEntry ? (
            <>
              <View style={styles.rowCenter}>
                <Text style={styles.moodEmoji}>{sentimentEmoji}</Text>
                <Text style={styles.moodLabel}>{sentimentText}</Text>
              </View>

              <Text style={styles.summaryText}>{lastEntry.summary}</Text>
              <View style={styles.divider} />
              <Text style={styles.suggestionTitle}>Suggestion</Text>
              <Text style={styles.suggestionText}>{lastEntry.suggestion}</Text>
            </>
          ) : (
            <Text style={styles.placeholderResult}>
              After analysis, your mood summary and a small suggestion will
              appear here.
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  topBar: {
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FBFBFBFF',
    textAlign: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFFFF',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FBF7F1',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A433C',
    marginBottom: 10,
  },
  input: {
    borderRadius: 18,
    backgroundColor: '#F3E8DD',
    padding: 12,
    minHeight: 110,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#3E3A36',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#F6A544',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  moodLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A433C',
  },
  summaryText: {
    fontSize: 14,
    color: '#5A524A',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E1D7CC',
    marginVertical: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A433C',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: '#5A524A',
  },
  placeholderResult: {
    fontSize: 13,
    color: '#9A8F86',
  },
});

export default DailyEntryScreen;
