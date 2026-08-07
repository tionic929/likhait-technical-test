require 'rails_helper'

RSpec.describe Expense, type: :model do
  let(:category) { Category.create!(name: "Food") }

  it "is valid with a date of today or in the past" do
    expense = Expense.new(description: "Lunch", amount: 15.00, category: category, date: Date.today)
    expect(expense).to be_valid
  end

  it "is invalid with a date in the future" do
    expense = Expense.new(description: "Future trip", amount: 100.00, category: category, date: Date.tomorrow)
    expect(expense).not_to be_valid
    expect(expense.errors[:date]).to include("cannot be in the future")
  end
end
