import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getExpenses, saveExpenses } from "../storage/expenseStorage";
import { useTheme } from "../constants/theme";

const CATEGORY_ICONS = {
  Food: "F",
  Transport: "T",
  Utilities: "U",
  Shopping: "S",
  Health: "H",
  Other: "O",
};

const FILTERS = [
  "All",
  "Food",
  "Transport",
  "Utilities",
  "Shopping",
  "Health",
  "Other",
];
const DATE_RANGES = ["All", "Today", "This Week", "This Month"];

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [total, setTotal] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, []),
  );

  const loadExpenses = async () => {
    const data = await getExpenses();
    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setExpenses(sorted);
    setTotal(sorted.reduce((acc, e) => acc + parseFloat(e.amount), 0));
  };

  const getDateRange = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    if (dateRange === "Today") {
      return { from: today, to: today };
    } else if (dateRange === "This Week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      const from = `${weekAgo.getFullYear()}-${pad(weekAgo.getMonth() + 1)}-${pad(weekAgo.getDate())}`;
      return { from, to: today };
    } else if (dateRange === "This Month") {
      const from = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
      return { from, to: today };
    }
    return { from: null, to: null };
  };

  const filteredExpenses = expenses.filter((e) => {
    const categoryMatch = filter === "All" || e.category === filter;
    const { from, to } = getDateRange();
    const fromMatch = !from || e.date >= from;
    const toMatch = !to || e.date <= to;
    return categoryMatch && fromMatch && toMatch;
  });

  const deleteExpense = (id) => {
    Alert.alert("Remove Expense", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const data = await getExpenses();
          await saveExpenses(data.filter((e) => e.id !== id));
          loadExpenses();
        },
      },
    ]);
  };

  const s = makeStyles(theme);

  const renderItem = ({ item }) => {
    const cat = theme.categories[item.category] || theme.categories.Other;
    return (
      <View style={s.card}>
        <View style={[s.iconWrap, { backgroundColor: cat.bg }]}>
          <Text style={[s.iconSymbol, { color: cat.color }]}>
            {CATEGORY_ICONS[item.category] || "◉"}
          </Text>
        </View>
        <View style={s.cardBody}>
          <Text style={s.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={s.cardMeta}>
            {item.category} · {item.date}
          </Text>
          {item.notes ? (
            <Text style={s.cardNotes} numberOfLines={1}>
              {item.notes}
            </Text>
          ) : null}
        </View>
        <View style={s.cardEnd}>
          <Text style={[s.cardAmount, { color: cat.color }]}>
            Rs {parseFloat(item.amount).toLocaleString()}
          </Text>
          <View style={s.actionRow}>
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: theme.primaryGlow }]}
              onPress={() =>
                navigation.navigate("Add Expense", { expense: item })
              }
            >
              <Text style={[s.actionIcon, { color: theme.primary }]}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: "rgba(255,90,90,0.10)" }]}
              onPress={() => deleteExpense(item.id)}
            >
              <Text style={[s.actionIcon, { color: theme.danger }]}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const thisMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      <View style={s.hero}>
        <Text style={s.heroLabel}>Total Spent</Text>
        <Text style={s.heroAmount}>
          Rs {total.toLocaleString("en", { maximumFractionDigits: 0 })}
        </Text>
        <View style={s.heroPill}>
          <Text style={s.heroPillText}>{expenses.length} transactions</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "700",
            color: theme.textMuted,
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Category
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterBar}
        contentContainerStyle={s.filterContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              s.filterChip,
              {
                backgroundColor: filter === f ? theme.primary : theme.card,
                borderColor: filter === f ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={[
                s.filterText,
                { color: filter === f ? "#fff" : theme.textMuted },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Date Range Filter - fixed */}
      <View style={{ paddingHorizontal: 16, paddingTop: 6 }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "700",
            color: theme.textMuted,
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Date Range
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterBar}
        contentContainerStyle={s.filterContent}
      >
        {DATE_RANGES.map((range) => (
          <TouchableOpacity
            key={range}
            onPress={() => setDateRange(range)}
            style={[
              s.filterChip,
              {
                backgroundColor:
                  dateRange === range ? theme.primary : theme.card,
                borderColor: dateRange === range ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={[
                s.filterText,
                { color: dateRange === range ? "#fff" : theme.textMuted },
              ]}
            >
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {expenses.length > 0 && (
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Recent</Text>
          <Text style={s.sectionCount}>{filteredExpenses.length} entries</Text>
        </View>
      )}

      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={[s.emptyIcon, { backgroundColor: theme.surface }]}>
              <Text style={[s.emptyIconText, { color: theme.primary }]}>
                Rs
              </Text>
            </View>
            <Text style={s.emptyTitle}>No expenses yet</Text>
            <Text style={s.emptySub}>
              Tap the + button to log your first expense
            </Text>
          </View>
        }
      />
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.background },
    hero: {
      backgroundColor: theme.card,
      paddingHorizontal: 24,
      paddingTop: Platform.OS === "ios" ? 20 : 24,
      paddingBottom: 28,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      alignItems: "flex-start",
    },
    heroLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.textMuted,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    heroAmount: {
      fontSize: 38,
      fontWeight: "800",
      color: theme.text,
      letterSpacing: -1,
      marginBottom: 12,
    },
    heroPill: {
      backgroundColor: theme.primaryGlow,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
    },
    heroPillText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.primary,
      letterSpacing: 0.3,
    },
    filterBar: { maxHeight: 56 },
    filterContent: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
      alignItems: "center",
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
    },
    filterText: { fontSize: 12, fontWeight: "600" },
    sectionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 8,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.text,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    sectionCount: { fontSize: 12, color: theme.textMuted, fontWeight: "500" },
    list: { paddingHorizontal: 16, paddingBottom: 32 },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 13,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    iconSymbol: { fontSize: 18, fontWeight: "800" },
    cardBody: { flex: 1, marginRight: 10 },
    cardTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 3,
    },
    cardMeta: {
      fontSize: 12,
      color: theme.textMuted,
      fontWeight: "500",
      letterSpacing: 0.2,
    },
    cardNotes: {
      fontSize: 11,
      color: theme.textMuted,
      marginTop: 3,
      fontStyle: "italic",
    },
    cardEnd: { alignItems: "flex-end" },
    cardAmount: {
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 8,
      letterSpacing: -0.3,
    },
    actionRow: { flexDirection: "row", gap: 6 },
    actionBtn: {
      width: 28,
      height: 28,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    actionIcon: { fontSize: 13, fontWeight: "700" },
    empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    emptyIconText: { fontSize: 18, fontWeight: "800" },
    emptyTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
    },
    emptySub: {
      fontSize: 13,
      color: theme.textMuted,
      textAlign: "center",
      lineHeight: 20,
    },
  });
