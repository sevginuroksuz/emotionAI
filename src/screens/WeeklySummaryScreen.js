import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MoodContext } from '../context/MoodContext';

const moodColors = {
  positive: '#F6A544',
  neutral: '#B3A8A0',
  negative: '#E57373',
};

function WeeklySummaryScreen() {
  const { state } = useContext(MoodContext);
  const { entries, loading } = state;

  // Son 7 günün verilerini hesapla
  const {
    positiveCount,
    neutralCount,
    negativeCount,
    total,
    dominantSentiment,
  } = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const recent = entries.filter((e) => {
      const d = new Date(e.createdAt);
      return d >= sevenDaysAgo && d <= now;
    });

    let pos = 0;
    let neu = 0;
    let neg = 0;

    recent.forEach((e) => {
      if (e.sentiment === 'positive') pos += 1;
      else if (e.sentiment === 'negative') neg += 1;
      else neu += 1;
    });

    const totalCount = pos + neu + neg;

    let dominant = 'neutral';
    if (totalCount > 0) {
      if (pos >= neu && pos >= neg) dominant = 'positive';
      else if (neg >= pos && neg >= neu) dominant = 'negative';
      else dominant = 'neutral';
    }

    return {
      positiveCount: pos,
      neutralCount: neu,
      negativeCount: neg,
      total: totalCount,
      dominantSentiment: dominant,
    };
  }, [entries]);

  const percentage = (count) =>
    total === 0 ? 0 : Math.round((count / total) * 100);

  const dominantColor = moodColors[dominantSentiment] || moodColors.neutral;
  const dominantLabel =
    dominantSentiment === 'positive'
      ? 'Mostly Positive'
      : dominantSentiment === 'negative'
      ? 'Mostly Negative'
      : 'Mostly Neutral';

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (total === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No entries this week 🗓️</Text>
        <Text style={styles.emptyText}>
          Write a few daily entries and your weekly mood summary
          will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>EmotionAi</Text>
      <Text style={styles.screenTitle}>Weekly Summary</Text>

      {/* Özet halka */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>This week</Text>
        <View style={styles.donutRow}>
          <View style={[styles.donutOuter, { borderColor: dominantColor }]}>
            <View style={styles.donutInner}>
              <Text style={styles.donutLabel}>{dominantLabel}</Text>
            </View>
          </View>

          <View style={styles.statsColumn}>
            <StatRow
              label="Positive"
              color={moodColors.positive}
              count={positiveCount}
              percent={percentage(positiveCount)}
            />
            <StatRow
              label="Neutral"
              color={moodColors.neutral}
              count={neutralCount}
              percent={percentage(neutralCount)}
            />
            <StatRow
              label="Negative"
              color={moodColors.negative}
              count={negativeCount}
              percent={percentage(negativeCount)}
            />
          </View>
        </View>

        <Text style={styles.helperText}>
          All of your analysis results are stored locally on this device.
          You can view this summary even when you are offline.
        </Text>
      </View>
    </View>
  );
}

function StatRow({ label, color, count, percent }) {
  return (
    <View style={styles.statRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.flexSpacer} />
      <Text style={styles.statPercent}>{percent}%</Text>
      <Text style={styles.statCount}> ({count})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E8',
    paddingHorizontal: 20,
    paddingTop: 24,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3E3A36',
    textAlign: 'center',
    marginBottom: 8,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4A433C',
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: '#FBF7F1',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A433C',
    marginBottom: 12,
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donutOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  donutInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FBF7F1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  donutLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A433C',
    textAlign: 'center',
  },
  statsColumn: {
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#4A433C',
  },
  flexSpacer: {
    flex: 1,
  },
  statPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A433C',
  },
  statCount: {
    fontSize: 13,
    color: '#8A8178',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A433C',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#8A8178',
    textAlign: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#8A8178',
    marginTop: 12,
  },
});

export default WeeklySummaryScreen;
