import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { PaperRocketEmail, SAMPLE, Strong, usePaperRocketTheme } from '../paperrocket';
import type { TemplateDocumentCancelProps } from '../template-components/template-document-cancel';

export type DocumentCancelEmailTemplateProps = Partial<TemplateDocumentCancelProps>;

export const DocumentCancelTemplate = ({
  inviterName = SAMPLE.senderName,
  documentName = SAMPLE.documentName,
  cancellationReason,
}: DocumentCancelEmailTemplateProps) => {
  const { _ } = useLingui();
  const theme = usePaperRocketTheme();

  // paperrocket-sign: a branded organisation cancels as itself, never as the account holder.
  const canceller = theme.isBranded ? theme.name : inviterName;

  return (
    <PaperRocketEmail
      preheader={_(msg`${canceller} has cancelled "${documentName}". You don't need to sign it.`)}
      eyebrow={_(msg`Cancelled`)}
      eyebrowTone="alert"
      title={documentName}
      lede={
        <Trans>
          <Strong>{canceller}</Strong> has cancelled this document and voided any signatures, so you don't need to sign
          it.
        </Trans>
      }
      message={cancellationReason ? { label: _(msg`Reason`), text: cancellationReason } : undefined}
      senderName={canceller}
      footerNote="notice"
    />
  );
};

export default DocumentCancelTemplate;
