import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getExpenses, saveExpenses } from "../storage/expenseStorage";
import { useTheme } from "../constants/theme";

const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Shopping",
  "Health",
  "Other",
];

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDisplayDate = (date) => {
  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function AddExpenseScreen({ navigation, route }) {
  const { theme, isDark } = useTheme();
  const editingExpense = route.params?.expense;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(String(editingExpense.amount));
      setCategory(editingExpense.category);
      const d = new Date(editingExpense.date);
      setSelectedDate(d);
      setTempDate(d);
      setNotes(editingExpense.notes || "");
    } else {
      setTitle("");
      setAmount("");
      setCategory("Food");
      setSelectedDate(new Date());
      setTempDate(new Date());
      setNotes("");
      setErrors({});
    }
  }, [editingExpense]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    } else if (title.trim().length > 50) {
      newErrors.title = "Title must be under 50 characters";
    } else if (/\d/.test(title.trim())) {
      newErrors.title = "Title cannot contain numbers";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amount)) {
      newErrors.amount = "Enter a valid number";
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (parseFloat(amount) > 10000000) {
      newErrors.amount = "Amount seems too large";
    }

    if (notes.trim().length > 200) {
      newErrors.notes = "Notes must be under 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSave = async () => {
    if (!validate()) return;

    const expense = {
      id: editingExpense ? editingExpense.id : Date.now().toString(),
      title: title.trim(),
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      category,
      date: formatDate(selectedDate),
      notes: notes.trim(),
    };

    const existing = await getExpenses();
    const updated = editingExpense
      ? existing.map((e) => (e.id === expense.id ? expense : e))
      : [...existing, expense];

    await saveExpenses(updated);
    navigation.navigate("Home");
  };

  const onDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "set" && date) {
        setSelectedDate(date);
        setTempDate(date);
      }
    } else {
      if (date) setTempDate(date);
    }
  };

  const confirmIOSDate = () => {
    setSelectedDate(tempDate);
    setShowDatePicker(false);
  };

  const cancelIOSDate = () => {
    setTempDate(selectedDate);
    setShowDatePicker(false);
  };

  const s = makeStyles(theme);

  const getInputStyle = (fieldName) => [
    s.input,
    focusedField === fieldName && s.inputFocused,
    errors[fieldName] && s.inputError,
  ];

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={s.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={s.pageHeader}>
        <Text style={s.pageTitle}>
          {editingExpense ? "Edit Expense" : "New Expense"}
        </Text>
        <Text style={s.pageSub}>
          {editingExpense
            ? "Update the details below"
            : "Fill in the details to log an expense"}
        </Text>
      </View>

      <View style={s.form}>
        {/* Title */}
        <View style={s.fieldGroup}>
          <Text style={s.label}>Title</Text>
          <TextInput
            style={getInputStyle("title")}
            placeholder="e.g. Grocery run, Uber ride"
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              clearError("title");
            }}
            onFocus={() => setFocusedField("title")}
            onBlur={() => setFocusedField(null)}
            maxLength={55}
          />
          {errors.title ? (
            <Text style={s.errorText}>{errors.title}</Text>
          ) : null}
        </View>

        {/* Amount */}
        <View style={s.fieldGroup}>
          <Text style={s.label}>Amount (Rs)</Text>
          <View style={s.amountWrap}>
            <View
              style={[
                s.currencyTag,
                {
                  borderColor: errors.amount
                    ? theme.danger
                    : theme.primary + "40",
                },
              ]}
            >
              <Text style={[s.currencyText, { color: theme.primary }]}>Rs</Text>
            </View>
            <TextInput
              style={[getInputStyle("amount"), s.amountInput]}
              placeholder="0"
              placeholderTextColor={theme.textMuted}
              value={amount}
              onChangeText={(t) => {
                setAmount(t);
                clearError("amount");
              }}
              keyboardType="numeric"
              onFocus={() => setFocusedField("amount")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          {errors.amount ? (
            <Text style={s.errorText}>{errors.amount}</Text>
          ) : null}
        </View>

        {/* Category */}
        <View style={s.fieldGroup}>
          <Text style={s.label}>Category</Text>
          <View style={s.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              const catColor = theme.primary;
              const catBg = theme.primaryGlow;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    s.catChip,
                    isSelected
                      ? { backgroundColor: catBg, borderColor: catColor }
                      : {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                  ]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      s.catChipText,
                      { color: isSelected ? catColor : theme.textSecondary },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Date Picker */}
        <View style={s.fieldGroup}>
          <Text style={s.label}>Date</Text>
          <TouchableOpacity
            style={s.dateBtn}
            onPress={() => {
              setTempDate(selectedDate);
              setShowDatePicker(true);
            }}
            activeOpacity={0.75}
          >
            <View style={s.dateBtnLeft}>
              <View
                style={[s.dateIconBox, { backgroundColor: theme.primaryGlow }]}
              >
                <Text style={[s.dateIconText, { color: theme.primary }]}>
                  📅
                </Text>
              </View>
              <View>
                <Text style={[s.dateDisplay, { color: theme.text }]}>
                  {formatDisplayDate(selectedDate)}
                </Text>
                <Text style={[s.dateFormatted, { color: theme.textMuted }]}>
                  {formatDate(selectedDate)}
                </Text>
              </View>
            </View>
            <Text style={[s.dateChevron, { color: theme.textMuted }]}>›</Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
        {Platform.OS === "ios" && (
          <Modal visible={showDatePicker} transparent animationType="slide">
            <View style={s.modalOverlay}>
              <View
                style={[
                  s.modalSheet,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={s.modalHeader}>
                  <TouchableOpacity onPress={cancelIOSDate} style={s.modalBtn}>
                    <Text style={[s.modalBtnText, { color: theme.textMuted }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <Text style={[s.modalTitle, { color: theme.text }]}>
                    Select Date
                  </Text>
                  <TouchableOpacity onPress={confirmIOSDate} style={s.modalBtn}>
                    <Text style={[s.modalBtnText, { color: theme.primary }]}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  style={{ backgroundColor: theme.card }}
                  textColor={theme.text}
                />
              </View>
            </View>
          </Modal>
        )}
        <View style={s.fieldGroup}>
          <View style={s.labelRow}>
            <Text style={s.label}>Notes</Text>
            <Text style={s.optional}>optional · {notes.length}/200</Text>
          </View>
          <TextInput
            style={[getInputStyle("notes"), s.notesInput]}
            placeholder="Any extra details..."
            placeholderTextColor={theme.textMuted}
            value={notes}
            onChangeText={(t) => {
              setNotes(t);
              clearError("notes");
            }}
            multiline
            maxLength={205}
            onFocus={() => setFocusedField("notes")}
            onBlur={() => setFocusedField(null)}
          />
          {errors.notes ? (
            <Text style={s.errorText}>{errors.notes}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[s.saveBtn, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={s.saveBtnText}>
            {editingExpense ? "Update Expense" : "Save Expense"}
          </Text>
        </TouchableOpacity>

        {editingExpense && (
          <TouchableOpacity
            style={s.cancelBtn}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.7}
          >
            <Text style={[s.cancelBtnText, { color: theme.textMuted }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.background },
    scrollContent: { paddingBottom: 48 },
    pageHeader: {
      paddingHorizontal: 24,
      paddingTop: Platform.OS === "ios" ? 20 : 24,
      paddingBottom: 24,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    pageTitle: {
      fontSize: 26,
      fontWeight: "800",
      color: theme.text,
      letterSpacing: -0.5,
      marginBottom: 4,
    },
    pageSub: { fontSize: 13, color: theme.textSecondary, fontWeight: "500" },
    form: { padding: 20 },
    fieldGroup: { marginBottom: 20 },
    labelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    label: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.textMuted,
      letterSpacing: 1.1,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    optional: {
      fontSize: 10,
      fontWeight: "500",
      color: theme.textMuted,
      letterSpacing: 0.3,
    },
    input: {
      backgroundColor: theme.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 13,
      fontSize: 15,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.text,
      fontWeight: "500",
    },
    inputFocused: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryGlow,
    },
    inputError: {
      borderColor: theme.danger,
      backgroundColor: theme.danger + "08",
    },
    errorText: {
      fontSize: 11,
      color: theme.danger,
      fontWeight: "600",
      marginTop: 5,
      letterSpacing: 0.2,
    },
    amountWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
    currencyTag: {
      backgroundColor: theme.primaryGlow,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 13,
      borderWidth: 1,
    },
    currencyText: { fontSize: 14, fontWeight: "700", letterSpacing: 0.3 },
    amountInput: { flex: 1, fontSize: 18, fontWeight: "700" },
    notesInput: { height: 90, textAlignVertical: "top", paddingTop: 13 },
    categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    catChip: {
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1.5,
    },
    catChipText: { fontSize: 13, fontWeight: "600", letterSpacing: 0.2 },

    dateBtn: {
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dateBtnLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    dateIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    dateIconText: { fontSize: 18 },
    dateDisplay: { fontSize: 14, fontWeight: "600", marginBottom: 1 },
    dateFormatted: { fontSize: 11, fontWeight: "500" },
    dateChevron: { fontSize: 22, fontWeight: "300" },

    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalSheet: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderWidth: 1,
      paddingBottom: 34,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    modalTitle: { fontSize: 15, fontWeight: "700" },
    modalBtn: { paddingHorizontal: 4, paddingVertical: 4 },
    modalBtnText: { fontSize: 15, fontWeight: "600" },

    saveBtn: {
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 8,
    },
    saveBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    cancelBtn: {
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 8,
    },
    cancelBtnText: { fontSize: 14, fontWeight: "600" },
  });
