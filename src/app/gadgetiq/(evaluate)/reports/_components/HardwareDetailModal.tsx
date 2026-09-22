'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Cpu,
  Layers,
  HardDrive,
  Activity,
  Code2,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Server,
  Cable,
  Flame,
} from 'lucide-react';
import { HardwareDetailData } from '../types';
import { fetchHardwareDetailById } from '../services';

interface HardwareDetailModalProps {
  identifier: string | number | null;
  onClose: () => void;
}

export const HardwareDetailModal: React.FC<HardwareDetailModalProps> = ({
  identifier,
  onClose,
}) => {
  const [detail, setDetail] = useState<HardwareDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'ports' | 'specs' | 'stress' | 'raw'>('diagnostics');

  const loadData = () => {
    if (!identifier) return;
    setLoading(true);
    setError(null);
    fetchHardwareDetailById(identifier)
      .then((data) => setDetail(data))
      .catch((err) => setError(err.message || 'Failed to load device details'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (identifier) {
      loadData();
    } else {
      setDetail(null);
      setError(null);
    }
  }, [identifier]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!identifier) return null;

  const handleCopyRaw = () => {
    if (!detail) return;
    const jsonStr = JSON.stringify(detail.all_fields || detail, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderBadge = (val?: string) => {
    const raw = (val || 'Not Tested').trim();
    const str = raw.toUpperCase();
    if (str === 'PASS' || str === 'PASSED' || str === '1') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>PASS</span>
        </span>
      );
    }
    if (str === 'FAIL' || str === 'FAILED' || str === '0' || str.includes('FAIL')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
          <span>FAIL</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        <MinusCircle className="w-3 h-3 text-slate-400 shrink-0" />
        <span>{raw || 'Not Tested'}</span>
      </span>
    );
  };

  const diagnostics = detail?.hardware_diagnostics || {};
  const specs = detail?.component_specs || {};
  const ident: Partial<HardwareDetailData['identification']> = detail?.identification || {
    brand_name: '',
    model_name: '',
    serial_number: String(identifier),
    imei_1: String(identifier),
    device_category: 'Hardware',
    QCResult: 'Not Tested',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {ident.brand_name || ident.model_name
                  ? `${ident.brand_name || ''} ${ident.model_name || ''}`.trim()
                  : `Device Inspection (#${identifier})`}
              </h2>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
              <span>
                Serial / Barcode:{' '}
                <span className="font-mono font-semibold text-slate-700">
                  {ident.serial_number || ident.imei_1 || identifier}
                </span>
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Category:{' '}
                <span className="font-semibold text-indigo-600">
                  {ident.device_category || 'Hardware'}
                </span>
              </span>
              {ident.workorderid && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>
                    WO: <span className="font-mono font-semibold text-slate-700">{ident.workorderid}</span>
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 text-indigo-600 font-medium">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-xs text-slate-500">Fetching comprehensive hardware diagnostics...</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-rose-900">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition"
              >
                Retry Inspection
              </button>
            </div>
          )}

          {detail && !loading && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">QC Result</div>
                  <div className="mt-1.5">{renderBadge(ident.QCResult || ident.test_result)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Physical Grade</div>
                  <div className="mt-1 font-bold text-slate-800 text-sm">{ident.grade || ident.physical_condition_category || 'N/A'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tested By (UID)</div>
                  <div className="mt-1 font-mono font-semibold text-slate-800 text-xs truncate">
                    {ident.uid || ident.createdBy || 'N/A'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Evaluation Date</div>
                  <div className="mt-1 font-mono text-slate-700 text-xs truncate">
                    {ident.test_date_time || ident.CreatedOn || 'Recent'}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 space-x-1 overflow-x-auto pb-px">
                {[
                  { key: 'diagnostics', label: 'Core Diagnostics', icon: Activity },
                  { key: 'ports', label: 'Ports & I/O', icon: Cable },
                  { key: 'specs', label: 'Hardware Specs', icon: Server },
                  { key: 'stress', label: 'Stress & Firmware', icon: Flame },
                  { key: 'raw', label: 'All Raw Fields', icon: Code2 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Core Diagnostics */}
              {activeTab === 'diagnostics' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Motherboard Test', val: diagnostics.motherboard_test_result },
                    { label: 'CPU Test', val: diagnostics.cpu_test_result },
                    { label: 'RAM Test', val: diagnostics.ram_test_result },
                    { label: 'Storage Test', val: diagnostics.storage_test_result },
                    { label: 'PCIe Slots Test', val: diagnostics.pciexpress_test_result },
                    { label: 'Integrated GPU', val: diagnostics.gpu_test_result },
                    { label: 'Dedicated GPU Card', val: diagnostics.gpu_card_test_result },
                    { label: 'Cooling Fan Test', val: diagnostics.fan_test_result },
                    { label: 'Wi-Fi Test', val: diagnostics.wireless_test_result },
                    { label: 'Bluetooth Test', val: diagnostics.bluetooth_test_result },
                    { label: 'Ethernet LAN Test', val: diagnostics.wired_ethernet_test_result },
                    { label: 'Internet Gateway', val: diagnostics.internet_test_result },
                    { label: 'Audio Playback', val: diagnostics.audioplayback_test_result },
                    { label: 'Speaker Test', val: diagnostics.speaker_test_result },
                    { label: 'Microphone Test', val: diagnostics.mic_test_result },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                      {renderBadge(item.val)}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Ports & I/O */}
              {activeTab === 'ports' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Front Audio Port', val: diagnostics.front_audio_port_test_result },
                    { label: 'Back Audio Port', val: diagnostics.back_audio_port_test_result },
                    { label: 'Front Mic Port', val: diagnostics.front_microphone_port_test_result },
                    { label: 'Back Mic Port', val: diagnostics.back_microphone_port_test_result },
                    { label: 'DisplayPort (DP)', val: diagnostics.display_port_test_result },
                    { label: 'DVI Video Port', val: diagnostics.dvi_port_test_result },
                    { label: 'USB Ports', val: diagnostics.usb_test_result },
                    { label: 'SD Card Slot', val: diagnostics.sd_card_slot_test_result },
                    { label: 'Optical Disk Drive', val: diagnostics.optical_disk_drive_test_result },
                    { label: 'Earphone Jack', val: diagnostics.earphone_jack_test_result },
                    { label: 'Earphone Audio', val: diagnostics.earphone_test_result },
                    { label: 'Earphone Mic', val: diagnostics.earphone_mic_test_result },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                      {renderBadge(item.val)}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Hardware Specs */}
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Processor Family</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{specs.Processor_Family || 'N/A'}</div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Processor Generation</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{specs.Generation || 'N/A'}</div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Installed Memory (RAM)</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{specs.RAM || 'N/A'}</div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Primary Storage (HDD/SSD)</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{specs.HDD_SSD || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Graphics Card (GPU)</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{specs.Graphics_Card || 'N/A'}</div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">BIOS Version</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5 font-mono">{specs.bios_version || 'N/A'}</div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Motherboard Serial Number</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5 font-mono">{specs.mbd_serial_number || 'N/A'}</div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System SKU / Chassis</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5 font-mono">
                        {specs.system_sku || specs.chassis_number || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Stress & Firmware */}
              {activeTab === 'stress' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'CPU Stress Test', val: diagnostics.cpu_stress_test_result },
                    { label: 'RAM Stress Test', val: diagnostics.ram_stress_test_result },
                    { label: 'GPU Stress Test', val: diagnostics.gpu_stress_test_result },
                    { label: 'Storage Stress Test', val: diagnostics.ssdhdd_stress_test_result },
                    { label: 'Battery Stress Test', val: diagnostics.battery_stress_test_result },
                    { label: 'Power / Charger Test', val: diagnostics.charger_test_result },
                    { label: 'Windows Activation', val: diagnostics.win_activation_test_result },
                    { label: 'ME Version Test', val: diagnostics.me_version_test_result },
                    { label: 'ME Version String', val: diagnostics.me_version },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                      {typeof item.val === 'string' && ['PASS', 'FAIL', '1', '0', 'NOT TESTED'].includes(item.val.toUpperCase()) ? (
                        renderBadge(item.val)
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-800">{item.val || 'N/A'}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Raw Data */}
              {activeTab === 'raw' && (
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={handleCopyRaw}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium transition cursor-pointer border border-slate-700 shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs overflow-x-auto font-mono max-h-[50vh] border border-slate-800 shadow-inner">
                    {JSON.stringify(detail.all_fields || detail, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3.5 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            {ident.ServiceKey ? `ServiceKey: ${ident.ServiceKey}` : `MstID: ${ident.mstid || identifier}`}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
