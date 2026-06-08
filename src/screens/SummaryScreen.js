import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getExpenses } from "../storage/expenseStorage";
import { useTheme } from "../constants/theme";

export default function SummaryScreen() {
  const { theme, isDark } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [topExpense, setTopExpense] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    const data = await getExpenses();
    setExpenses(data);
    const sum = data.reduce((acc, e) => acc + parseFloat(e.amount), 0);
    setTotal(sum);

    const sorted = [...data].sort(
      (a, b) => parseFloat(b.amount) - parseFloat(a.amount),
    );
    const maxAmount = sorted[0] ? parseFloat(sorted[0].amount) : 0;
    const topExpenses = sorted.filter(
      (e) => parseFloat(e.amount) === maxAmount,
    );
    setTopExpense(topExpenses);

    const catMap = {};
    data.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + parseFloat(e.amount);
    });
    const catSorted = Object.entries(catMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
    setCategoryData(catSorted);
  };

  const avg = expenses.length > 0 ? total / expenses.length : 0;
  const s = makeStyles(theme);

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroLabel}>Overview</Text>
        <Text style={s.heroAmount}>
          Rs {total.toLocaleString("en", { maximumFractionDigits: 0 })}
        </Text>
        <Text style={s.heroSub}>across {expenses.length} expenses</Text>
      </View>

      <View style={s.content}>
        <View style={s.statsRow}>
          <View style={[s.statCard, { borderColor: theme.border }]}>
            <Text style={s.statLabel}>Transactions</Text>
            <Text style={[s.statValue, { color: theme.text }]}>
              {expenses.length}
            </Text>
          </View>
          <View style={[s.statCard, { borderColor: theme.border }]}>
            <Text style={s.statLabel}>Avg / Expense</Text>
            <Text style={[s.statValue, { color: theme.text }]}>
              Rs {Math.round(avg).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Top Expense */}
        {topExpense.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Largest Expense</Text>
            {topExpense.map((item, index) => (
              <View
                key={index}
                style={[
                  s.topCard,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                    marginBottom: 8,
                  },
                ]}
              >
                <View style={s.topCardLeft}>
                  <Text
                    style={[
                      s.topCatBadge,
                      {
                        backgroundColor: theme.categories[item.category]?.bg,
                        color: theme.categories[item.category]?.color,
                      },
                    ]}
                  >
                    {item.category}
                  </Text>
                  <Text style={s.topTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={s.topDate}>{item.date}</Text>
                </View>
                <Text
                  style={[
                    s.topAmount,
                    {
                      color:
                        theme.categories[item.category]?.color || theme.primary,
                    },
                  ]}
                >
                  Rs {parseFloat(item.amount).toLocaleString()}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Category Breakdown */}
        <Text style={s.sectionTitle}>By Category</Text>

        {categoryData.length === 0 ? (
          <View
            style={[
              s.emptyBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={s.emptyText}>No data to display yet.</Text>
          </View>
        ) : (
          categoryData.map((cat, index) => {
            const percent = total > 0 ? (cat.amount / total) * 100 : 0;
            const catStyle = theme.categories[cat.name] || {
              color: theme.primary,
              bg: theme.primaryGlow,
            };
            return (
              <View
                key={index}
                style={[
                  s.catCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={s.catTop}>
                  <View style={s.catLeft}>
                    <View
                      style={[s.catDot, { backgroundColor: catStyle.color }]}
                    />
                    <Text style={s.catName}>{cat.name}</Text>
                  </View>
                  <View style={s.catRight}>
                    <Text style={[s.catAmount, { color: catStyle.color }]}>
                      Rs{" "}
                      {cat.amount.toLocaleString("en", {
                        maximumFractionDigits: 0,
                      })}
                    </Text>
                    <Text style={s.catPercent}>{percent.toFixed(1)}%</Text>
                  </View>
                </View>

                <View style={[s.barBg, { backgroundColor: theme.border }]}>
                  <View
                    style={[
                      s.barFill,
                      { width: `${percent}%`, backgroundColor: catStyle.color },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
    },
    hero: {
      backgroundColor: theme.card,
      paddingHorizontal: 24,
      paddingTop: Platform.OS === "ios" ? 20 : 24,
      paddingBottom: 28,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    heroLabel: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.textSecondary,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    heroAmount: {
      fontSize: 38,
      fontWeight: "800",
      color: theme.text,
      letterSpacing: -1,
      marginBottom: 4,
      fontFamily: "Inter_800ExtraBold",
    },
    heroSub: {
      fontSize: 13,
      color: theme.textMuted,
      fontWeight: "500",
    },
    content: {
      padding: 20,
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 24,
      marginTop: 4,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      padding: 16,
    },
    statLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.textSecondary,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: -0.3,
      color: theme.text,
      fontFamily: "Inter_700Bold",
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.textSecondary,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 12,
      marginTop: 4,
    },
    topCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      marginBottom: 24,
    },
    topCardLeft: {
      flex: 1,
      marginRight: 12,
    },
    topCatBadge: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: "flex-start",
      marginBottom: 8,
      overflow: "hidden",
    },
    topTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 3,
    },
    topDate: {
      fontSize: 12,
      color: theme.textMuted,
      fontWeight: "500",
    },
    topAmount: {
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: -0.5,
    },
    catCard: {
      borderRadius: 14,
      borderWidth: 1,
      padding: 16,
      marginBottom: 8,
    },
    catTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    catLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    catDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    catName: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
    catRight: {
      alignItems: "flex-end",
    },
    catAmount: {
      fontSize: 14,
      fontWeight: "700",
      letterSpacing: -0.2,
    },
    catPercent: {
      fontSize: 11,
      color: theme.textMuted,
      fontWeight: "500",
      marginTop: 1,
    },
    barBg: {
      height: 5,
      borderRadius: 10,
      overflow: "hidden",
    },
    barFill: {
      height: 5,
      borderRadius: 10,
    },
    emptyBox: {
      borderRadius: 14,
      borderWidth: 1,
      padding: 24,
      alignItems: "center",
    },
    emptyText: {
      fontSize: 14,
      color: theme.textMuted,
      fontWeight: "500",
    },
  });
