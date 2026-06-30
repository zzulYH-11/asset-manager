package com.yuha.asset_manager.repository;

import com.yuha.asset_manager.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
