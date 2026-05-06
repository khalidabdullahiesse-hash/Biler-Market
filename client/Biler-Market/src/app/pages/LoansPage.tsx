import { useState, useEffect } from "react";
import { LoadingIndicator } from "../../components/application/loading-indicator/loading-indicator";
import {
  Search,
  MoreVertical,
  Check,
  Eye,
  DollarSign,
  RefreshCw,
  Trash2,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { getAllLoans, Loan, deleteLoan, createLoan } from "../api/api";

function fmt(num: number | undefined) {
  if (num === undefined || num === null) return "$0";
  return "$" + num.toLocaleString();
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRepaymentPct(
  paidAmount: number | undefined,
  totalAmount: number | undefined,
) {
  if (!totalAmount || totalAmount <= 0) return 0;
  const paid = paidAmount || 0;
  return Math.round((paid / totalAmount) * 100);
}

export function LoansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newLoanAmount, setNewLoanAmount] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await getAllLoans();
      // Ensure we get an array (backend should return array now)
      let loansData = Array.isArray(res.data) ? res.data : [];
      // Ensure each loan has remainAmount calculated
      loansData = loansData.map((loan) => ({
        ...loan,
        remainAmount:
          loan.remainAmount ?? loan.totalAmount - (loan.paidAmount || 0),
      }));
      setLoans(loansData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch loans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteLoan(id);
      fetchLoans();
    } catch (err) {
      console.error(err);
      alert("Failed to delete loan");
    }
  };

  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const amount = parseFloat(newLoanAmount);
    if (!amount || amount <= 0) {
      setCreateError("Please enter a valid amount greater than 0");
      return;
    }

    setCreating(true);
    try {
      await createLoan({
        totalAmount: amount,
        paidAmount: 0,
        remainAmount: amount,
        owner: "",
      });
      setNewLoanAmount("");
      fetchLoans();
      setCreateError(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to create loan";
      setCreateError(message);
    } finally {
      setCreating(false);
    }
  };

  const filteredLoans = loans.filter((loan) => {
    const q = searchQuery.toLowerCase();
    return (
      !q || String(loan.totalAmount).includes(q) || String(loan._id).includes(q)
    );
  });

  const activeCount = loans.filter((l) => l.remainAmount > 0).length;
  const fullyPaidCount = loans.filter((l) => l.remainAmount === 0).length;
  const totalValue = loans.reduce((sum, l) => sum + l.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Loans</h1>
          <p className="text-gray-600 mt-1">
            Manage your active and completed loans
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {activeCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Fully Paid</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {fullyPaidCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Borrowed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {fmt(totalValue)}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Loan Form */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Create New Loan
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateLoan} className="flex gap-4 items-end">
            <div className="flex-1 max-w-sm">
              <Label
                htmlFor="loanAmount"
                className="text-sm font-medium text-gray-700"
              >
                Loan Amount
              </Label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="Enter loan amount"
                value={newLoanAmount}
                onChange={(e) => setNewLoanAmount(e.target.value)}
                disabled={creating}
                className="mt-1"
                step="0.01"
                min="0"
              />
            </div>
            <Button type="submit" disabled={creating}>
              {creating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Loan
                </>
              )}
            </Button>
          </form>
          {createError && (
            <div className="mt-3 text-red-600 text-sm">{createError}</div>
          )}
        </CardContent>
      </Card>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by amount or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={fetchLoans} variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingIndicator type="line-simple" size="md" />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Total Amount
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Paid Amount
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Remaining
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Progress
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Created At
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map((loan) => {
                    const pct = getRepaymentPct(
                      loan.paidAmount,
                      loan.totalAmount,
                    );
                    return (
                      <tr
                        key={loan._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-xs font-mono text-gray-500">
                          {loan._id?.slice(-6)}
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-900">
                          {fmt(loan.totalAmount)}
                        </td>
                        <td className="py-4 px-4 font-medium text-green-600">
                          {fmt(loan.paidAmount)}
                        </td>
                        <td className="py-4 px-4 font-medium text-yellow-600">
                          {fmt(loan.remainAmount)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="w-28">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-gray-500">
                                {pct}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-500 text-sm">
                          {loan.createdAt ? fmtDate(loan.createdAt) : "—"}
                        </td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  loan._id && handleDelete(loan._id)
                                }
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLoans.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-gray-500"
                      >
                        No loans found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
