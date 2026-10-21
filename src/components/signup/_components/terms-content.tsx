import "@/styles/terms/terms.css";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { getTop, getTos } from "@/api/terms/terms";
import { LoadingErrorFallback } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  onAgreed: (agreements: { service: boolean; privacy: boolean }) => void;
  setTosId: (v: string | undefined) => void;
  setTopId: (v: string | undefined) => void;
};

export const TermsContent = ({ 
  onAgreed,
  setTosId,
  setTopId 
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
  });

  const [allAgreed, setAllAgreed] = useState(false);
  const { i18n } = useTranslation();
  const langCd = i18n.language;

  const { data: tos, isLoading: tosLoading, error: tosError } = useQuery({
    queryKey: ['tos', langCd],
    queryFn: () => getTos(langCd),
  });
  const { data: top, isLoading: topLoading, error: topError } = useQuery({
    queryKey: ['top', langCd],
    queryFn: () => getTop(langCd),
  });

  if (tosLoading || topLoading) {
    return <LoadingErrorFallback status="loading" />;
  }
  if (tosError || topError) {
    return <LoadingErrorFallback status="error" />;
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setAgreements((prev) => {
      const updated = { ...prev, [name]: checked };
      setAllAgreed(updated.service && updated.privacy);
      return updated;
    });
  };

  const handleAllAgreeChange = (checked: boolean) => {
    setAllAgreed(checked);
    setAgreements({
      service: checked,
      privacy: checked,
    });
  };

  const handleNext = () => {
    if (agreements.service && agreements.privacy) {
      onAgreed(agreements);
      setTosId(tos?.id);
      setTopId(top?.id);
    } else {
      toast.warning(
        t('msg.terms.requiredAgree', {
          defaultValue: '필수 약관에 모두 동의해야 합니다.',
        }),
      );
    }
  }; 

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[55rem]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center text-foreground">
            {t('col.terms.agree', { defaultValue: '서비스 약관 동의' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 전체 동의 */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-agree"
              checked={allAgreed}
              onCheckedChange={(checked) =>
                handleAllAgreeChange(checked as boolean)
              }
            />
            <label htmlFor="all-agree" className="text-sm font-medium text-foreground">
              {t('col.terms.allAgree', { defaultValue: '모두 동의' })}
            </label>
          </div>

          {/* 서비스 이용약관 */}
          <div className="space-y-2">
            <ScrollArea className="h-80 w-full rounded-md border p-4">
              {tos && (
                <div
                  className="prose prose-sm max-w-none text-foreground dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: tos.content ?? ""}}
                />
              )}
            </ScrollArea>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="service"
                checked={agreements.service}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("service", checked as boolean)
                }
              />
              <label htmlFor="service" className="text-sm text-foreground">
                {t('col.terms.service.required', { defaultValue: '(필수) 서비스 이용약관' })}
              </label>
            </div>
          </div>

          {/* 개인정보 이용약관 */}
          <div className="space-y-2">
            <ScrollArea className="h-80 w-full rounded-md border p-4">
              {top && (
                <div
                  className="prose prose-sm max-w-none text-foreground dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: top.content ?? "" }}
                />
              )}
            </ScrollArea>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy"
                checked={agreements.privacy}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("privacy", checked as boolean)
                }
              />
              <label htmlFor="privacy" className="text-sm text-foreground">
                {t('col.terms.privacy.required', { defaultValue: '(필수) 개인정보 수집 및 이용' })}
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
              {t('btn.cancel', { defaultValue: '취소' })}
            </Button>
            <Button
              className="flex-1"
              variant="success"
              onClick={handleNext}
              disabled={!agreements.service || !agreements.privacy}
            >
              {t('btn.next', { defaultValue: '다음' })}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
