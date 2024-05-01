import { type FC } from "react";
import { TransactionView as TransactionViewSchema, type Transaction, TransactionBodyView as TransactionBodyViewSchema, MemoView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1/transaction_pb";
import { makeActionView } from "@/lib/protobuf";
import { TransactionBodyView } from "./TransactionBodyView";

const makeTransactionView = ({ body, ...tx }: Transaction) : TransactionViewSchema => {

  const actionViews = body?.actions.map((action) => makeActionView(action)).flatMap(view => view ? [view] : []) ?? undefined;

  const bodyView = body ? new TransactionBodyViewSchema({
    actionViews,
    transactionParameters: body.transactionParameters,
    detectionData: body.detectionData,
    memoView: body.memo && new MemoView({
      memoView: {
        case: "opaque",
        value: {
          ciphertext: body.memo,
        },
      },
    }),
  }) : undefined;

  return new TransactionViewSchema({
    bodyView,
    anchor: tx.anchor,
    bindingSig: tx.bindingSig,
  });
};

interface TransactionViewProps {
  tx: Transaction
}

export const TransactionView : FC<TransactionViewProps> = ({ tx }) => {
  const txView = makeTransactionView(tx);
  return (
    <div className="flex flex-col sm:items-start items-center w-full gap-y-1">
      <div className="flex flex-col items-center w-full">
        <p className="text-sm font-semibold">TransactionBodyView</p>
        {txView.bodyView ? (<TransactionBodyView bodyView={txView.bodyView}/>) : "None"}
      </div>
      <div className="flex flex-col items-center w-full">
        <p className="w-full">Binding Signature</p>
        <pre className="w-full">{txView.bindingSig ? txView.bindingSig.inner: "None"}</pre>
        </div>
      <div className="flex flex-col items-center w-full">
        <p className="w-full">Anchor</p>
        <pre className="w-full">{txView.anchor ? txView.anchor.inner : "None"}</pre>
      </div>
    </div>
  );
};