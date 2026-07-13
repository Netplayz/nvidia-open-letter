---
title: "An Open Letter to NVIDIA: Fully Open Source Your Linux GPU Drivers"
author: "The Linux Community"
date: "July 2026"
---

# An Open Letter to NVIDIA: Fully Open Source Your Linux GPU Drivers

**To:** NVIDIA Corporation, Leadership and Linux Driver Engineering Teams

**From:** Developers, system administrators, researchers, and users of the Linux ecosystem

**Date:** July 2026

---

## Introduction

NVIDIA has taken meaningful steps toward open-source GPU driver support on Linux. The open-sourcing of the Linux GPU kernel modules under dual GPL/MIT licensing in 2022, and the transition to making them the default for Turing and newer architectures, was a landmark moment. We acknowledge and appreciate this progress.

However, the work is incomplete. The user-space driver components---including OpenGL, Vulkan, and CUDA libraries---remain closed-source binaries. The GSP firmware that now handles critical GPU initialization and management tasks is not open. This means that while the thin kernel interface layer is open, the vast majority of the driver logic that developers, researchers, and enterprises depend on remains opaque.

**We respectfully request that NVIDIA commit to fully open-sourcing all remaining components of the Linux GPU driver stack, including user-space libraries and GSP firmware specifications, across all supported driver versions.**

---

## Why NVIDIA Should Open Source Its Drivers

### 1. Security Demands Transparency

NVIDIA's Linux drivers have been subject to numerous critical vulnerabilities. In May 2026 alone, NVIDIA patched multiple high-severity issues:

- **CVE-2026-24187** (CVSS 8.8 HIGH): A use-after-free vulnerability in the display driver allowing privilege escalation, code execution, and data tampering.
- **CVE-2026-24194** (CVSS 7.8 HIGH): Improper permission handling in the kernel mode layer enabling denial of service, privilege escalation, and information disclosure.
- **CVE-2026-24190** (CVSS 7.8 HIGH): Missing authorization in the kernel mode layer allowing improper access to GPU resources.
- **CVE-2026-24198** (CVSS 5.3 MEDIUM): Race condition enabling sensitive memory leaks.

These are not theoretical risks. In October 2025, Quarkslab researchers published a complete exploit chain demonstrating how vulnerabilities in the open kernel modules could be chained to achieve arbitrary kernel read/write---a full system compromise. The exploit targeted `nvidia.ko` and `nvidia-uvm.ko`, modules that expose ioctls accessible to unprivileged users.

When driver code is closed-source, only NVIDIA's internal teams can audit it. The broader security community is prevented from doing what it does best: finding and reporting vulnerabilities before malicious actors exploit them. The Linux kernel community, security researchers at universities, and independent auditors worldwide could contribute to hardening a driver stack that runs on millions of systems.

**Open-sourcing the remaining driver components would dramatically expand the pool of eyes on this security-critical code.**

### 2. The Enterprise and AI Industry Runs on Linux with NVIDIA GPUs

NVIDIA's datacenter business is built on Linux. Every major cloud provider---AWS, Azure, GCP---runs NVIDIA GPUs with Linux drivers for AI training, HPC workloads, and inference. The NVIDIA Grace Hopper and Blackwell platforms are Linux-only. CUDA, NVIDIA's most commercially important software product, is primarily a Linux technology.

Enterprise customers increasingly require the ability to audit the software running in their datacenters. Financial institutions, healthcare organizations, and government agencies subject their entire software stack to security review. Closed-source drivers are a black box that cannot be independently verified.

By fully open-sourcing the driver stack, NVIDIA would:

- Enable enterprise security teams to perform independent audits
- Reduce the time between vulnerability discovery and remediation
- Build greater trust with the organizations spending billions on NVIDIA hardware
- Align with the security expectations of regulated industries

### 3. Academic and Industrial Research Is Hindered

The opacity of NVIDIA's closed-source user-space driver directly impacts research. A 2026 academic paper, *"Revealing NVIDIA Closed-Source Driver Command Streams for CPU-GPU Runtime Behavior Insight,"* had to develop elaborate instrumentation workarounds---installing hardware watchpoints on GPU doorbell registers and intercepting kernel memory mapping paths---simply to observe what commands the user-space driver sends to the GPU.

The researchers noted: *"Much of the logic that realizes CUDA operations resides in NVIDIA's closed-source userspace driver. As a result, the translation from high-level CUDA APIs to low-level hardware commands remains opaque, limiting both software understanding and performance attribution."*

This is not an isolated case. Understanding GPU scheduling, memory management, power behavior, and performance characteristics requires either reverse engineering or complex dynamic analysis---both of which are fragile and non-reproducible. Open-source drivers would allow researchers to study GPU architecture properly, leading to better tools, better optimization, and ultimately better hardware utilization that benefits NVIDIA's own customers.

### 4. NVIDIA Has Already Proven Open Source Works

NVIDIA has demonstrated that open-sourcing kernel modules does not harm its business. The open kernel modules have achieved **equivalent or better** application performance compared to the proprietary versions. New capabilities like heterogeneous memory management, confidential computing, and coherent memory architectures were added to the open modules---not the proprietary ones.

For Blackwell (RTX 50 series), the open kernel module is the **only** supported option. NVIDIA stopped extending the proprietary kernel module to new architectures. The trajectory is clear: the kernel layer is moving to open source.

The question is no longer *whether* open-sourcing driver components is viable---NVIDIA has already proven it is. The question is why the user-space components, which contain the most commercially sensitive logic, should remain closed when the kernel layer is already open.

### 5. The Community Is Building Alternatives Whether NVIDIA Opens Up or Not

The open-source community is not waiting passively. Several major projects are actively building fully open NVIDIA driver stacks:

- **Nova**: A Rust-written open-source NVIDIA GPU driver merged into the Linux kernel in 6.15 (May 2025) as the first Rust DRM driver in mainline. It is being actively developed by NVIDIA engineers and the community, targeting Hopper and Blackwell enablement.
- **NVK (Mesa)**: Achieved Vulkan 1.4 conformance across Kepler through Blackwell GPUs. Became the default OpenGL path for Turing and newer via Zink. Supports the full range of NVIDIA desktop GPU generations.
- **Nouveau**: Continues to serve as the upstream kernel driver, with GSP firmware enabling automatic reclocking on Turing and newer hardware.

These projects demonstrate that open-source alternatives will eventually reach feature parity. When they do, NVIDIA's closed-source user-space libraries become a competitive disadvantage rather than an asset. Customers who can get equivalent performance from an open stack will choose openness for the auditability, customization, and community support it provides.

**NVIDIA has the opportunity to lead this transition rather than be disrupted by it.**

### 6. The User-Space Components Are the Real Competitive Moat

NVIDIA's leadership in GPU computing is not primarily in the kernel driver layer---it is in CUDA, cuDNN, TensorRT, OptiX, and the optimization expertise embedded in the user-space libraries. These are the components that developers depend on and that NVIDIA monetizes through its ecosystem.

Open-sourcing these components does not give away NVIDIA's competitive advantage. The value is in:

- The breadth of the CUDA ecosystem and tooling
- The performance optimization expertise of NVIDIA's engineers
- The integration with NVIDIA's hardware roadmap
- The support and maintenance infrastructure

AMD open-sourced its user-space driver components through Mesa and ROCm. This did not destroy AMD's GPU business. Instead, it accelerated adoption, improved driver quality through community contributions, and made AMD hardware more attractive to Linux-dependent industries.

Open-sourcing would transform NVIDIA's driver from a liability---a closed binary that must be manually installed and maintained---into a strength: a fully integrated, community-supported, distribution-native driver stack.

### 7. Reduced Maintenance Burden

NVIDIA has acknowledged that maintaining both proprietary and open kernel module branches was expensive. The decision to consolidate on open kernel modules was driven partly by the cost of running test matrices across both configurations. The same logic applies to the full driver stack.

Every new Linux kernel release requires porting work. Every distribution update can break compatibility. Every security vulnerability requires coordinated patching across multiple closed-source components. The maintenance burden is significant and growing.

An open-source driver stack benefits from:

- Upstream maintenance by the Linux kernel community
- Distribution-native packaging and testing
- Community-contributed patches and bug fixes
- Reduced version-matching complexity between kernel and user-space components

---

## Our Request

We request that NVIDIA publicly commit to the following roadmap:

1. **Open-source the user-space driver components** (OpenGL, Vulkan, CUDA libraries) under a permissive open-source license (GPL v2+ or MIT) for all currently supported Linux driver versions.

2. **Publish GSP firmware documentation** sufficient for the community to develop fully open-source drivers without dependence on binary blobs, or alternatively, release the GSP firmware itself under an open-source license.

3. **Maintain backwards compatibility** by ensuring that older driver versions (R535, R580 legacy branches) also receive open-source releases, protecting users on hardware that has reached end-of-mainline-support.

4. **Engage with the upstream Linux community** to integrate NVIDIA's open-source driver components into the mainline kernel and Mesa, following the model that AMD and Intel have successfully adopted.

---

## Conclusion

NVIDIA stands at a pivotal moment. The company has already taken the hardest step---open-sourcing kernel modules and proving it does not harm the business. The remaining closed components are the barrier between NVIDIA and full integration into the Linux ecosystem that its datacenter business depends on.

The security implications of keeping driver code closed are severe and well-documented. The research community is building workarounds for problems that open source would simply eliminate. The open-source community is building alternatives that will eventually reach parity.

NVIDIA can choose to lead this transition, building goodwill with the Linux community and enterprise customers, or it can resist and be overtaken by the very open-source projects it has already begun contributing to.

The Linux ecosystem has been patient. NVIDIA has shown good faith with the kernel modules. We ask NVIDIA to take the next step and complete the journey to full open-source GPU driver support on Linux.

---

*This letter represents the views of Linux developers, system administrators, security researchers, and users who depend on NVIDIA GPU hardware in their daily work. We welcome dialogue with NVIDIA on this matter.*

*To add your name to this letter, submit a pull request adding your entry to the signatures table.*
